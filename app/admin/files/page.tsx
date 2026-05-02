'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { Upload, FileText, Trash2, Copy, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getFiles, saveFileRecord, deleteFileRecord, FileItem } from '@/lib/fileStore';

export default function FilesManagementPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }
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
          <button 
            onClick={handleUploadClick}
            disabled={uploading}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        <div className="bg-white border border-border-main p-6">
          <div 
            onClick={handleUploadClick}
            className="border-2 border-dashed border-border-main p-10 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {uploading ? (
               <Loader2 size={32} className="animate-spin mx-auto text-primary mb-3" />
            ) : (
               <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            )}
            <p className="font-bold text-primary">{uploading ? 'Uploading...' : 'Click to upload or drag and drop'}</p>
            <p className="text-sm text-text-muted mt-1">PDF, DOCX, JPG, PNG (Max 10MB)</p>
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
                    files.map((file) => (
                      <tr key={file.id} className="hover:bg-hover-bg">
                        <td className="px-4 py-3 font-medium text-text-main flex items-center gap-2">
                          {file.type === 'Image' ? <ImageIcon size={16} className="text-blue-500" /> : <FileText size={16} className="text-red-500" />}
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                            {file.name}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-text-muted">{file.type}</td>
                        <td className="px-4 py-3 text-text-muted">{formatSize(file.size)}</td>
                        <td className="px-4 py-3 text-text-muted">{formatDate(file.created_at)}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button onClick={() => copyToClipboard(file.url)} className="text-secondary hover:underline mr-3 inline-flex items-center gap-1" title="Copy URL">
                            <Copy size={14}/> Copy URL
                          </button>
                          <button onClick={() => handleDelete(file.id)} className="text-red-600 hover:underline inline-flex items-center gap-1">
                            <Trash2 size={14}/> Delete
                          </button>
                        </td>
                      </tr>
                    ))
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
