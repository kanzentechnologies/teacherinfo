'use client';

import React, { useState, useEffect } from 'react';
import { getFiles, FileItem } from '@/lib/fileStore';
import { X, Folder, FileText, Image as ImageIcon, ChevronRight, ChevronDown, CheckSquare } from 'lucide-react';

interface TreeFileSelectorProps {
  onSelectFolder?: (folderPath: string, filesInFolder: FileItem[]) => void;
  onSelectFile?: (file: FileItem) => void;
  onClose: () => void;
  title?: string;
  mode: 'file' | 'folder' | 'both';
}

type TreeNode = {
  name: string;
  path: string;
  type: 'folder' | 'file';
  file?: FileItem;
  children: Record<string, TreeNode>;
};

const TreeNodeComponent = ({
  node,
  allFiles,
  expandedFolders,
  toggleFolder,
  onSelectFolder,
  onSelectFile,
  mode
}: {
  node: TreeNode;
  allFiles: FileItem[];
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
  onSelectFolder?: (folderPath: string, filesInFolder: FileItem[]) => void;
  onSelectFile?: (file: FileItem) => void;
  mode: 'file' | 'folder' | 'both';
}) => {
  const isExpanded = expandedFolders.has(node.path);
  const isFolder = node.type === 'folder';

  if (node.path === '') {
    // Root node, just render children
    return (
      <div className="flex flex-col gap-1">
        {Object.values(node.children)
          .sort((a, b) => {
            // Folders first
            if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
            return a.name.localeCompare(b.name);
          })
          .map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              allFiles={allFiles}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              onSelectFolder={onSelectFolder}
              onSelectFile={onSelectFile}
              mode={mode}
            />
          ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between group hover:bg-blue-50/50 p-1.5 rounded transition-colors border border-transparent hover:border-blue-100">
        <div 
          className={`flex items-center gap-2 flex-1 min-w-0 ${isFolder ? 'cursor-pointer' : ''}`}
          onClick={() => isFolder ? toggleFolder(node.path) : undefined}
        >
          <div className="w-5 flex justify-center text-gray-400">
            {isFolder && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </div>
          {isFolder ? (
            <Folder size={18} className="text-blue-500 flex-shrink-0" />
          ) : (
            node.file?.type === 'Image' ? 
              <ImageIcon size={18} className="text-blue-400 flex-shrink-0" /> : 
              <FileText size={18} className="text-red-400 flex-shrink-0" />
          )}
          <span className="text-sm font-medium text-text-main truncate" title={node.name}>
            {node.name}
          </span>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isFolder && (mode === 'folder' || mode === 'both') && onSelectFolder && (
            <button
              onClick={() => {
                const filesInFolder = allFiles.filter(f => f.name.startsWith(node.path + '/'));
                onSelectFolder(node.path, filesInFolder);
              }}
              className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded font-bold whitespace-nowrap flex items-center gap-1"
            >
              <CheckSquare size={12} /> Select Folder
            </button>
          )}
          {!isFolder && (mode === 'file' || mode === 'both') && onSelectFile && node.file && (
            <button
              onClick={() => onSelectFile(node.file!)}
              className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded font-bold whitespace-nowrap flex items-center gap-1"
            >
              <CheckSquare size={12} /> Select File
            </button>
          )}
        </div>
      </div>
      
      {isFolder && isExpanded && (
        <div className="ml-5 pl-2 border-l border-gray-200 flex flex-col gap-1 mt-1">
          {Object.values(node.children)
            .sort((a, b) => {
              if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
              return a.name.localeCompare(b.name);
            })
            .map((child) => (
              <TreeNodeComponent
                key={child.path}
                node={child}
                allFiles={allFiles}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                onSelectFolder={onSelectFolder}
                onSelectFile={onSelectFile}
                mode={mode}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export function TreeFileSelector({ onSelectFolder, onSelectFile, onClose, title = "Select File / Folder", mode }: TreeFileSelectorProps) {
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<TreeNode>({ name: 'root', path: '', type: 'folder', children: {} });
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const data = await getFiles();
        setAllFiles(data);
        
        const root: TreeNode = { name: 'root', path: '', type: 'folder', children: {} };
        const initialExpanded = new Set<string>();

        data.forEach(file => {
          const parts = file.name.split('/');
          let current = root;
          let currentPath = '';
          parts.forEach((part, index) => {
            currentPath += (currentPath ? '/' : '') + part;
            if (index === parts.length - 1) {
              current.children[part] = {
                name: part,
                path: currentPath,
                type: 'file',
                file: file,
                children: {}
              };
            } else {
              if (!current.children[part]) {
                current.children[part] = {
                  name: part,
                  path: currentPath,
                  type: 'folder',
                  children: {}
                };
              }
              // Optionally expand top level folders by default
              if (index === 0) initialExpanded.add(currentPath);
              current = current.children[part];
            }
          });
        });
        
        setTree(root);
        setExpandedFolders(initialExpanded);
      } catch (err) {
        console.error('Failed to fetch files:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-border-main flex justify-between items-center bg-gray-50 rounded-t-lg">
          <div>
            <h2 className="text-lg font-bold text-primary">{title}</h2>
            <p className="text-xs text-text-muted mt-1">
              {mode === 'both' ? 'Select an entire folder or a specific file.' : mode === 'folder' ? 'Select an entire folder.' : 'Select a specific file.'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 bg-white">
          {loading ? (
            <div className="text-center py-8 text-text-muted">Loading structure...</div>
          ) : allFiles.length === 0 ? (
            <div className="text-center py-8 text-text-muted italic">
              No files found in storage.
            </div>
          ) : (
            <div className="border border-border-main p-2 rounded-lg bg-gray-50/30">
              <TreeNodeComponent
                node={tree}
                allFiles={allFiles}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                onSelectFolder={onSelectFolder}
                onSelectFile={onSelectFile}
                mode={mode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
