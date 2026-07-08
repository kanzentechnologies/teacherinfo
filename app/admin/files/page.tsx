'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { Upload, FileText, Trash2, Copy, Image as ImageIcon, Loader2, Folder, ChevronDown, ChevronRight, Edit2, CheckSquare } from 'lucide-react';
import { getFiles, FileItem } from '@/lib/fileStore';

export default function FilesManagementPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
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
      }
      await fetchFiles();
      alert(`Successfully uploaded ${successCount} files!`);
    } catch (err: any) {
      alert('Error uploading folder: ' + err.message);
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (folderInputRef.current) folderInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
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
      const res = await fetch('/api/files/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isFolder ? { folders: [key] } : { keys: [key] })
      });
      
      if (!res.ok) throw new Error('Delete failed');
      await fetchFiles();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
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
      setLoading(true);
      const res = await fetch('/api/files/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys, folders })
      });
      if (!res.ok) throw new Error('Bulk delete failed');
      await fetchFiles();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
      setLoading(false);
    }
  };

  const handleRename = async (oldKey: string, isFolder = false) => {
    const newName = prompt(`Enter new name for ${isFolder ? 'folder' : 'file'}:`, oldKey.split('/').pop());
    if (!newName) return;
    
    const parts = oldKey.split('/');
    parts.pop(); // remove old name
    parts.push(newName);
    const newKey = parts.join('/');
    
    if (oldKey === newKey) return;
    
    try {
      setLoading(true);
      const res = await fetch('/api/files/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldKey, newKey, isFolder })
      });
      if (!res.ok) throw new Error('Rename failed');
      await fetchFiles();
    } catch (err: any) {
      alert('Failed to rename: ' + err.message);
      setLoading(false);
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
      <tr key={file.id} className="hover:bg-hover-bg">
        <td className="px-4 py-3 font-medium text-text-main flex items-center gap-2" style={{ paddingLeft: `${depth * 1.5 + (depth > 0 ? 2.5 : 1)}rem` }}>
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
        </td>
        <td className="px-4 py-3 text-text-muted">{file.type}</td>
        <td className="px-4 py-3 text-text-muted">{formatSize(file.size)}</td>
        <td className="px-4 py-3 text-text-muted">{formatDate(file.created_at)}</td>
        <td className="px-4 py-3 text-right whitespace-nowrap">
          <button onClick={() => copyToClipboard(file.url)} className="text-secondary hover:underline mr-3 inline-flex items-center gap-1" title="Copy URL">
            <Copy size={14}/> Copy
          </button>
          <button onClick={() => handleRename(file.id, false)} className="text-blue-600 hover:underline mr-3 inline-flex items-center gap-1" title="Rename File">
            <Edit2 size={14}/> Rename
          </button>
          <button onClick={() => handleDelete(file.id, false)} className="text-red-600 hover:underline inline-flex items-center gap-1">
            <Trash2 size={14}/> Del
          </button>
        </td>
      </tr>
    );
  };

  const renderTree = (node: TreeNode, path: string, depth: number) => {
    const result: React.ReactNode[] = [];
    
    // Render files in this node
    node.files.forEach(file => {
      result.push(renderFileRow(file, depth));
    });
    
    // Render subfolders
    Object.keys(node.folders).sort().forEach(folderName => {
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
          className="bg-gray-50 hover:bg-gray-100 border-t border-border-main"
        >
          <td colSpan={4} className="px-4 py-3 font-bold text-primary flex items-center gap-2" style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}>
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={() => toggleSelection(fullPath, 'folder')}
              className="cursor-pointer mr-1"
            />
            <div className="cursor-pointer flex items-center gap-2" onClick={() => toggleFolder(fullPath)}>
              {isExpanded ? <ChevronDown size={18} className="min-w-[18px]" /> : <ChevronRight size={18} className="min-w-[18px]" />}
              <Folder size={18} className="text-blue-500 min-w-[18px]" />
              <span className="truncate max-w-[200px] sm:max-w-md">{folderName}</span> 
              <span className="text-text-muted font-normal text-xs ml-2">({count} item{count !== 1 ? 's' : ''})</span>
            </div>
          </td>
          <td className="px-4 py-3 text-right whitespace-nowrap">
            <button onClick={() => handleRename(fullPath, true)} className="text-blue-600 hover:underline mr-3 inline-flex items-center gap-1" title="Rename Folder">
              <Edit2 size={14}/> Rename
            </button>
            <button onClick={() => handleDelete(fullPath, true)} className="text-red-600 hover:underline inline-flex items-center gap-1">
              <Trash2 size={14}/> Del
            </button>
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
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

        <div className="bg-white border border-border-main">
          {loading ? (
            <div className="p-8 text-center text-text-muted">Loading files from R2...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-border-main text-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">File Name</th>
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
