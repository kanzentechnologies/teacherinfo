import React, { useState, useEffect } from 'react';
import { getFiles, FileItem } from '@/lib/fileStore';
import { FileText, Image as ImageIcon, X } from 'lucide-react';

interface FileSelectorProps {
  onSelect: (file: FileItem) => void;
  onClose: () => void;
}

export function FileSelector({ onSelect, onClose }: FileSelectorProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-border-main flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">Select a File</h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-1 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-8 text-text-muted">Loading files...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-text-muted italic">
              No files uploaded yet. Go to File Management to upload files.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="border border-border-main rounded p-3 hover:bg-blue-50 cursor-pointer flex items-start gap-3 transition-colors"
                  onClick={() => onSelect(file)}
                >
                  <div className="mt-1">
                    {file.type === 'Image' ? <ImageIcon className="text-blue-500" /> : <FileText className="text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-primary truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-text-muted mt-1">{file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
