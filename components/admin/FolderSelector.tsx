'use client';

import React, { useState, useEffect } from 'react';
import { getFiles, FileItem } from '@/lib/fileStore';
import { X, Folder } from 'lucide-react';

interface FolderSelectorProps {
  onSelect: (folderPath: string, filesInFolder: FileItem[]) => void;
  onClose: () => void;
}

export function FolderSelector({ onSelect, onClose }: FolderSelectorProps) {
  const [folders, setFolders] = useState<string[]>([]);
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const data = await getFiles();
        setAllFiles(data);
        
        // Extract unique folder paths (everything before the last slash)
        const uniqueFolders = new Set<string>();
        data.forEach(file => {
          if (file.name.includes('/')) {
            const folderPath = file.name.substring(0, file.name.lastIndexOf('/'));
            uniqueFolders.add(folderPath);
          }
        });
        
        setFolders(Array.from(uniqueFolders).sort());
      } catch (err) {
        console.error('Failed to fetch files for folders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleSelect = (folderPath: string) => {
    // Get all files inside this folder (and subfolders)
    const filesInFolder = allFiles.filter(f => f.name.startsWith(folderPath + '/'));
    onSelect(folderPath, filesInFolder);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-border-main flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-bold text-primary">Select a Folder to Import</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-8 text-text-muted">Loading folders...</div>
          ) : folders.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              No folders found. Upload a folder in the File Manager first.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {folders.map((folder) => {
                const count = allFiles.filter(f => f.name.startsWith(folder + '/')).length;
                return (
                  <button
                    key={folder}
                    onClick={() => handleSelect(folder)}
                    className="flex items-center gap-3 p-3 border border-border-main rounded hover:border-primary hover:bg-blue-50 transition-colors text-left group"
                  >
                    <Folder size={24} className="text-blue-500 group-hover:text-blue-600" />
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm text-text-main truncate" title={folder}>
                        {folder}
                      </div>
                      <div className="text-xs text-text-muted">{count} file{count !== 1 ? 's' : ''}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
