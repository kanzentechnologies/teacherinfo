'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { Upload, FileText, Trash2, Copy, Image as ImageIcon, Loader2, Folder, ChevronDown, ChevronRight, Edit2, CheckSquare } from 'lucide-react';
import { getFiles, FileItem } from '@/lib/fileStore';
import { OperationStatusOverlay } from '@/components/admin/OperationStatusOverlay';

export default function FilesManagementPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
  const [operationStatus, setOperationStatus] = useState<string | null>(null);
  const [operationDetails, setOperationDetails] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  const allSelectableItems = React.useMemo(() => {
    const items = new Set<string>();
    files.forEach(f => {
      items.add(JSON.stringify({ key: f.id, type: 'file' }));
      const parts = f.name.split('/');
      let currentPath = '';
      for (let i = 0; i < parts.length - 1; i++) {
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
        items.add(JSON.stringify({ key: currentPath, type: 'folder' }));
      }
    });
    return items;
  }, [files]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(new Set(allSelectableItems));
    } else {
      setSelectedItems(new Set());
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await getFiles();
      setFiles(data);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    } finally {
      setLoading(false);
      setOperationStatus(null);
      setOperationDetails(null);
      setSelectedItems(new Set());
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFolderUploadClick = () => {
    folderInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;
    
    setUploading(true);
    setUploadProgress({ current: 0, total: filesList.length });
    setOperationStatus('Uploading Folder');
    setOperationDetails('Preparing upload...');
    let successCount = 0;
    
    try {
      for (let i = 0; i < filesList.length; i++) {
        const file = filesList[i];
        if (file.name.startsWith('.')) continue; // Skip hidden files
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fullPath', file.webkitRelativePath || file.name);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await res.json();
        if (res.ok && data.success) {
          successCount++;
        }
        setUploadProgress(prev => prev ? { ...prev, current: prev.current + 1 } : null);
        setOperationDetails(`Uploading file ${i + 1} of ${filesList.length}`);
      }
      await fetchFiles();
      alert(`Successfully uploaded ${successCount} files!`);
    } catch (err: any) {
      alert('Error uploading folder: ' + err.message);
    } finally {
      setUploading(false);
      setUploadProgress(null);
      setOperationStatus(null);
      setOperationDetails(null);
      if (folderInputRef.current) folderInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setOperationStatus('Uploading File');
    setOperationDetails(file.name);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      await fetchFiles();
      alert('File uploaded successfully!');
    } catch (err: any) {
      alert('Error uploading file: ' + err.message);
      setOperationStatus(null);
      setOperationDetails(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (key: string, isFolder = false) => {
    const msg = isFolder 
      ? `Are you sure you want to delete the folder "${key}" and ALL its contents?` 
      : `Are you sure you want to delete "${key}"?`;
      
    if (!confirm(msg)) return;
    
    try {
      setUploadProgress({ current: 0, total: 1 });
      setOperationStatus(`Deleting ${isFolder ? 'Folder' : 'File'}`);
      setOperationDetails(key);
      const res = await fetch('/api/files/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isFolder ? { folders: [key] } : { keys: [key] })
      });
      
      if (!res.ok) throw new Error('Delete failed');
      setUploadProgress({ current: 1, total: 1 });
      await fetchFiles();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setOperationStatus(null);
      setOperationDetails(null);
      setUploadProgress(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedItems.size} selected item(s)?`)) return;
    
    const keys: string[] = [];
    const folders: string[] = [];
    
    selectedItems.forEach(itemStr => {
      const { type, key } = JSON.parse(itemStr);
      if (type === 'folder') folders.push(key);
      else keys.push(key);
    });
    
    try {
      const totalItems = keys.length + folders.length;
      setUploadProgress({ current: 0, total: totalItems });
      setOperationStatus('Deleting Items');
      setOperationDetails(`0 of ${totalItems} selected item(s) deleted`);
      
      let deletedCount = 0;
      
      // Delete folders sequentially
      for (const folder of folders) {
        const res = await fetch('/api/files/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keys: [], folders: [folder] }) });
        if (!res.ok) throw new Error('Delete folder failed');
        deletedCount++;
        setUploadProgress({ current: deletedCount, total: totalItems });
        setOperationDetails(`${deletedCount} of ${totalItems} selected item(s) deleted`);
      }

      // Delete files in chunks of 5
      for (let i = 0; i < keys.length; i += 5) {
        const chunk = keys.slice(i, i + 5);
        const res = await fetch('/api/files/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keys: chunk, folders: [] }) });
        if (!res.ok) throw new Error('Bulk delete failed');
        deletedCount += chunk.length;
        setUploadProgress({ current: Math.min(deletedCount, totalItems), total: totalItems });
        setOperationDetails(`${Math.min(deletedCount, totalItems)} of ${totalItems} selected item(s) deleted`);
      }
      
      await fetchFiles();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setOperationStatus(null);
      setOperationDetails(null);
      setUploadProgress(null);
    }
  };

  const handleRename = async (oldKey: string, isFolder = false) => {
    const currentName = oldKey.split('/').pop() || '';
    
    let defaultPrompt = currentName;
    let extension = '';
    
    if (!isFolder && currentName.includes('.')) {
      const nameParts = currentName.split('.');
      extension = '.' + nameParts.pop();
      defaultPrompt = nameParts.join('.');
    }
    
    const newNameInput = prompt(`Enter new name for ${isFolder ? 'folder' : 'file'} (without extension):`, defaultPrompt);
    if (!newNameInput || newNameInput.trim() === '') return;
    
    const newName = isFolder ? newNameInput.trim() : `${newNameInput.trim()}${extension}`;
    
    const parts = oldKey.split('/');
    parts.pop(); // remove old name
    parts.push(newName);
    const newKey = parts.join('/');
    
    if (oldKey === newKey) return;
    
    try {
      setOperationStatus(`Renaming ${isFolder ? 'Folder' : 'File'}`);
      setOperationDetails(`To: ${newName}`);
      const res = await fetch('/api/files/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldKey, newKey, isFolder })
      });
      if (!res.ok) throw new Error('Rename failed');
      await fetchFiles();
    } catch (err: any) {
      alert('Failed to rename: ' + err.message);
      setOperationStatus(null);
      setOperationDetails(null);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
  };

  type TreeNode = {
    name: string;
    files: FileItem[];
    folders: Record<string, TreeNode>;
  };

  const fileTree = React.useMemo(() => {
    const root: TreeNode = { name: 'Root', files: [], folders: {} };
    
    files.forEach(file => {
      const parts = file.name.split('/');
      if (parts.length === 1) {
        root.files.push(file);
      } else {
        let current = root;
        for (let i = 0; i < parts.length - 1; i++) {
          const folderName = parts[i];
          if (!current.folders[folderName]) {
            current.folders[folderName] = { name: folderName, files: [], folders: {} };
          }
          current = current.folders[folderName];
        }
        current.files.push(file);
      }
    });
    return root;
  }, [files]);

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) newExpanded.delete(folder);
    else newExpanded.add(folder);
    setExpandedFolders(newExpanded);
  };

  const toggleSelection = (key: string, type: 'file' | 'folder') => {
    const val = JSON.stringify({ key, type });
    const newSelected = new Set(selectedItems);
    if (newSelected.has(val)) newSelected.delete(val);
    else newSelected.add(val);
    setSelectedItems(newSelected);
  };

  const renderFileRow = (file: FileItem, depth: number = 0) => {
    const isSelected = selectedItems.has(JSON.stringify({ key: file.id, type: 'file' }));
    return (
      <tr key={file.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 font-medium text-text-main" style={{ paddingLeft: `${depth * 1.5 + (depth > 0 ? 2.5 : 1)}rem` }}>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={() => toggleSelection(file.id, 'file')}
              className="cursor-pointer mr-1"
            />
            {file.type === 'Image' ? <ImageIcon size={16} className="text-blue-500 min-w-[16px]" /> : <FileText size={16} className="text-red-500 min-w-[16px]" />}
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary break-words max-w-[150px] sm:max-w-sm truncate">
              {file.name.split('/').pop()}
            </a>
          </div>
        </td>
        <td className="px-4 py-3 text-text-muted">{file.type}</td>
        <td className="px-4 py-3 text-text-muted">{formatSize(file.size)}</td>
        <td className="px-4 py-3 text-text-muted">{formatDate(file.created_at)}</td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => copyToClipboard(file.url)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors" title="Copy URL">
              <Copy size={16}/>
            </button>
            <button onClick={() => handleRename(file.id, false)} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Rename File">
              <Edit2 size={16}/>
            </button>
            <button onClick={() => handleDelete(file.id, false)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete File">
              <Trash2 size={16}/>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderTree = (node: TreeNode, path: string, depth: number) => {
    const result: React.ReactNode[] = [];
    
    // Render files in this node
    node.files.sort((a, b) => {
      const nameA = a.name.split('/').pop() || '';
      const nameB = b.name.split('/').pop() || '';
      return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
    }).forEach(file => {
      result.push(renderFileRow(file, depth));
    });
    
    // Render subfolders
    Object.keys(node.folders).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })).forEach(folderName => {
      const fullPath = path ? `${path}/${folderName}` : folderName;
      const isExpanded = expandedFolders.has(fullPath);
      const isSelected = selectedItems.has(JSON.stringify({ key: fullPath, type: 'folder' }));
      
      const countFiles = (n: TreeNode): number => {
        return n.files.length + Object.values(n.folders).reduce((acc, f) => acc + countFiles(f), 0);
      };
      const count = countFiles(node.folders[folderName]);
      
      result.push(
        <tr 
          key={`folder-${fullPath}`}
          className="bg-gray-50 hover:bg-gray-100 border-t border-border-main transition-colors"
        >
          <td colSpan={4} className="px-4 py-3 font-bold text-primary" style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={() => toggleSelection(fullPath, 'folder')}
                className="cursor-pointer mr-1"
              />
              <div className="cursor-pointer flex items-center gap-2" onClick={() => toggleFolder(fullPath)}>
                {isExpanded ? <ChevronDown size={18} className="min-w-[18px] text-gray-500" /> : <ChevronRight size={18} className="min-w-[18px] text-gray-500" />}
                <Folder size={18} className="text-blue-500 min-w-[18px]" />
                <span className="truncate max-w-[200px] sm:max-w-md">{folderName}</span> 
                <span className="text-text-muted font-normal text-xs ml-2">({count} item{count !== 1 ? 's' : ''})</span>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => handleRename(fullPath, true)} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Rename Folder">
                <Edit2 size={16}/>
              </button>
              <button onClick={() => handleDelete(fullPath, true)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Folder">
                <Trash2 size={16}/>
              </button>
            </div>
          </td>
        </tr>
      );
      
      if (isExpanded) {
        result.push(...renderTree(node.folders[folderName], fullPath, depth + 1));
      }
    });
    
    return result;
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6 relative min-h-[400px]">
        
        <div className="bg-white border border-border-main p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">File Management</h1>
            <p className="text-sm text-text-muted">Directly synced with Cloudflare R2 Storage</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
          />
          <input 
            type="file" 
            ref={folderInputRef} 
            onChange={handleFolderChange} 
            className="hidden" 
            {...{webkitdirectory: "", directory: ""}}
          />
          <div className="flex gap-2 flex-wrap">
            {selectedItems.size > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="bg-red-50 text-red-600 border border-red-200 font-bold py-2 px-4 rounded-sm hover:bg-red-100 transition-colors flex items-center gap-2 text-sm"
              >
                <Trash2 size={18} />
                Delete Selected ({selectedItems.size})
              </button>
            )}
            <button 
              onClick={handleFolderUploadClick}
              disabled={uploading}
              className="bg-gray-100 text-primary font-bold py-2 px-4 rounded-sm hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <Upload size={18} />
              {uploading && uploadProgress ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...` : uploading ? 'Uploading...' : 'Upload Folder'}
            </button>
            <button 
              onClick={handleUploadClick}
              disabled={uploading}
              className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <Upload size={18} />
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-border-main relative min-h-[200px]">
          <OperationStatusOverlay 
            status={operationStatus} 
            details={operationDetails}
            progress={uploadProgress ? (uploadProgress.current / uploadProgress.total) * 100 : undefined} 
          />
          {loading && !operationStatus ? (
            <div className="p-8 text-center text-text-muted flex flex-col items-center">
              <Loader2 size={32} className="animate-spin text-gray-400 mb-3" />
              Loading files from R2...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-border-main text-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          className="cursor-pointer"
                          checked={selectedItems.size > 0 && selectedItems.size === allSelectableItems.size}
                          ref={input => {
                            if (input) {
                              input.indeterminate = selectedItems.size > 0 && selectedItems.size < allSelectableItems.size;
                            }
                          }}
                          onChange={handleSelectAll}
                          title="Select All"
                        />
                        <span>File Name</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Size</th>
                    <th className="px-4 py-3 font-medium">Upload Date</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  {files.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-text-muted italic">No files found in R2 Storage.</td>
                    </tr>
                  ) : (
                    renderTree(fileTree, '', 0)
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
