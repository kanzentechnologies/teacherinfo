'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { Upload, FileText, Trash2, Copy, Image as ImageIcon, Loader2, Folder, ChevronDown, ChevronRight } from 'lucide-react';
import { getFiles, saveFileRecord, deleteFileRecord, FileItem } from '@/lib/fileStore';

export default function FilesManagementPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
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
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    let successCount = 0;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.startsWith('.')) continue; // Skip hidden files
        
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await res.json();
        if (res.ok && data.success) {
          const fileRecord: FileItem = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
            name: file.webkitRelativePath || file.name,
            type: file.type.startsWith('image/') ? 'Image' : 'Document',
            size: file.size,
            url: data.url,
          };
          await saveFileRecord(fileRecord);
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

      const fileRecord: FileItem = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'Image' : 'Document',
        size: file.size,
        url: data.url,
      };

      await saveFileRecord(fileRecord);
      await fetchFiles();
      alert('File uploaded successfully!');
    } catch (err: any) {
      alert('Error uploading file: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file record?')) return;
    try {
      await deleteFileRecord(id);
      await fetchFiles();
    } catch (err: any) {
      alert('Failed to delete file: ' + err.message);
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

  const groupedFiles = React.useMemo(() => {
    const groups: Record<string, FileItem[]> = { 'Root': [] };
    files.forEach(file => {
      const parts = file.name.split('/');
      if (parts.length > 1) {
        const folder = parts.slice(0, -1).join('/');
        if (!groups[folder]) groups[folder] = [];
        groups[folder].push(file);
      } else {
        groups['Root'].push(file);
      }
    });
    return groups;
  }, [files]);

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) newExpanded.delete(folder);
    else newExpanded.add(folder);
    setExpandedFolders(newExpanded);
  };

  const renderFileRow = (file: FileItem, isSubFile: boolean = false) => (
    <tr key={file.id} className="hover:bg-hover-bg">
      <td className={`px-4 py-3 font-medium text-text-main flex items-center gap-2 ${isSubFile ? 'pl-10' : ''}`}>
        {file.type === 'Image' ? <ImageIcon size={16} className="text-blue-500" /> : <FileText size={16} className="text-red-500" />}
        <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary break-words max-w-[200px] sm:max-w-sm">
          {isSubFile ? file.name.split('/').pop() : file.name}
        </a>
      </td>
      <td className="px-4 py-3 text-text-muted">{file.type}</td>
      <td className="px-4 py-3 text-text-muted">{formatSize(file.size)}</td>
      <td className="px-4 py-3 text-text-muted">{formatDate(file.created_at)}</td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <button onClick={() => copyToClipboard(file.url)} className="text-secondary hover:underline mr-3 inline-flex items-center gap-1" title="Copy URL">
          <Copy size={14}/> Copy
        </button>
        <button onClick={() => handleDelete(file.id)} className="text-red-600 hover:underline inline-flex items-center gap-1">
          <Trash2 size={14}/> Del
        </button>
      </td>
    </tr>
  );

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">File Management</h1>
            <p className="text-sm text-text-muted">Upload and manage documents and images</p>
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
          <div className="flex gap-2">
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

        <div className="bg-white border border-border-main p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={handleUploadClick}
            className="border-2 border-dashed border-border-main p-10 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer rounded-sm"
          >
            {uploading ? (
               <Loader2 size={32} className="animate-spin mx-auto text-primary mb-3" />
            ) : (
               <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            )}
            <p className="font-bold text-primary">Upload File</p>
            <p className="text-sm text-text-muted mt-1">PDF, DOCX, JPG, PNG</p>
          </div>
          
          <div 
            onClick={handleFolderUploadClick}
            className="border-2 border-dashed border-border-main p-10 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer rounded-sm"
          >
            {uploading ? (
               <Loader2 size={32} className="animate-spin mx-auto text-primary mb-3" />
            ) : (
               <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            )}
            <p className="font-bold text-primary">Upload Folder</p>
            <p className="text-sm text-text-muted mt-1">Preserves directory structure</p>
          </div>
        </div>

        <div className="bg-white border border-border-main">
          {loading ? (
            <div className="p-8 text-center text-text-muted">Loading files...</div>
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
                      <td colSpan={5} className="px-4 py-8 text-center text-text-muted italic">No files found.</td>
                    </tr>
                  ) : (
                    <>
                      {/* Render root files */}
                      {groupedFiles['Root']?.map(file => renderFileRow(file, false))}
                      
                      {/* Render folders */}
                      {Object.keys(groupedFiles)
                        .filter(key => key !== 'Root')
                        .sort()
                        .map(folderName => (
                          <React.Fragment key={folderName}>
                            <tr 
                              className="bg-gray-50 hover:bg-gray-100 cursor-pointer border-t border-border-main"
                              onClick={() => toggleFolder(folderName)}
                            >
                              <td colSpan={5} className="px-4 py-3 font-bold text-primary flex items-center gap-2">
                                {expandedFolders.has(folderName) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                <Folder size={18} className="text-blue-500" />
                                {folderName} <span className="text-text-muted font-normal text-xs ml-2">({groupedFiles[folderName].length} files)</span>
                              </td>
                            </tr>
                            {expandedFolders.has(folderName) && (
                              groupedFiles[folderName].map(file => renderFileRow(file, true))
                            )}
                          </React.Fragment>
                      ))}
                    </>
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
