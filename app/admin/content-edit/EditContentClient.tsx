'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { getPageById, savePage, PageItem } from '@/lib/pageStore';
import { PlusCircle, Trash2, GripVertical, FileSearch, Upload, ChevronDown, ChevronRight, Folder, Image as ImageIcon, FileText } from 'lucide-react';
import * as xlsx from 'xlsx';
import { TreeFileSelector } from '@/components/admin/TreeFileSelector';
import { FileItem } from '@/lib/fileStore';
import { OperationStatusOverlay } from '@/components/admin/OperationStatusOverlay';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  type?: 'link' | 'folder';
  children?: LinkItem[];
  fileType?: string;
  fileSize?: number;
}

export default function EditContentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [item, setItem] = useState<PageItem | null>(null);
  const [content, setContent] = useState('');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationStatus, setOperationStatus] = useState<string | null>(null);
  const [showFileSelectorFor, setShowFileSelectorFor] = useState<string | null>(null);
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set());
  const [showDesc, setShowDesc] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFolderExpand = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) newExpanded.delete(folderId);
    else newExpanded.add(folderId);
    setExpandedFolders(newExpanded);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const found = await getPageById(id);
      if (found) {
        setItem(found);
        if (found.layout === 'links') {
          try {
            setLinks(JSON.parse(found.content || '[]'));
          } catch (e) {
            setLinks([]);
          }
        } else {
          setContent(found.content || '');
        }
      }
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  const handleSave = async () => {
    if (!item) return;
    try {
      setOperationStatus('Saving content...');
      const finalContent = item.layout === 'links' ? JSON.stringify(links) : content;
      await savePage({ ...item, content: finalContent });
      alert('Content saved successfully!');
      router.push('/admin/pages');
    } catch (err: any) {
      alert('Error saving content: ' + err.message);
    } finally {
      setOperationStatus(null);
    }
  };

  const handleAddLink = () => {
    setLinks([...links, { id: Date.now().toString(), title: '', url: '', description: '', type: 'link' }]);
  };

  const updateLinkInTree = (tree: LinkItem[], linkId: string, field: keyof LinkItem, value: any): LinkItem[] => {
    return tree.map(l => {
      if (l.id === linkId) return { ...l, [field]: value };
      if (l.children) return { ...l, children: updateLinkInTree(l.children, linkId, field, value) };
      return l;
    });
  };

  const updateLink = (linkId: string, field: keyof LinkItem, value: string) => {
    setLinks(prev => updateLinkInTree(prev, linkId, field, value));
  };

  const handleBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        if (!bstr) return;
        const wb = xlsx.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json<any>(ws);

        const importedLinks = data
          .map((row: any) => ({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
            title: row.Title || row.title || row.TITLE || '',
            url: row.URL || row.url || row.Url || '',
            description: row.Description || row.description || '',
          }))
          .filter((link) => link.title || link.url);

        setLinks((prev) => [...prev, ...importedLinks]);
        alert(`Successfully imported ${importedLinks.length} links!`);
      } catch (err) {
        alert('Error parsing file. Please ensure it is a valid Excel or CSV file.');
        console.error(err);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const removeLinkInTree = (tree: LinkItem[], linkId: string): LinkItem[] => {
    return tree.filter(l => l.id !== linkId).map(l => {
      if (l.children) return { ...l, children: removeLinkInTree(l.children, linkId) };
      return l;
    });
  };

  const removeLink = (linkId: string) => {
    setLinks(prev => removeLinkInTree(prev, linkId));
    if (selectedLinks.has(linkId)) {
      const newSelected = new Set(selectedLinks);
      newSelected.delete(linkId);
      setSelectedLinks(newSelected);
    }
  };

  const toggleSelectLink = (linkId: string) => {
    const newSelected = new Set(selectedLinks);
    if (newSelected.has(linkId)) {
      newSelected.delete(linkId);
    } else {
      newSelected.add(linkId);
    }
    setSelectedLinks(newSelected);
  };

  const toggleDesc = (linkId: string) => {
    const newShowDesc = new Set(showDesc);
    if (newShowDesc.has(linkId)) {
      newShowDesc.delete(linkId);
    } else {
      newShowDesc.add(linkId);
    }
    setShowDesc(newShowDesc);
  };

  const deleteSelectedInTree = (tree: LinkItem[], selected: Set<string>): LinkItem[] => {
    return tree.filter(l => !selected.has(l.id)).map(l => {
      if (l.children) return { ...l, children: deleteSelectedInTree(l.children, selected) };
      return l;
    });
  };

  const deleteSelected = () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedLinks.size} items?`)) return;
    setLinks(prev => deleteSelectedInTree(prev, selectedLinks));
    setSelectedLinks(new Set());
  };

  const getFlatIds = (tree: LinkItem[]): string[] => {
    let ids: string[] = [];
    for (const item of tree) {
      ids.push(item.id);
      if (item.children) ids = ids.concat(getFlatIds(item.children));
    }
    return ids;
  };

  const selectAll = () => {
    const allIds = getFlatIds(links);
    if (selectedLinks.size === allIds.length && allIds.length > 0) {
      setSelectedLinks(new Set());
    } else {
      setSelectedLinks(new Set(allIds));
    }
  };

  const handleFileSelect = (file: FileItem) => {
    if (showFileSelectorFor) {
      updateLink(showFileSelectorFor, 'url', file.url);
      
      const flatLinks: LinkItem[] = [];
      const flatten = (items: LinkItem[]) => {
        for (const item of items) {
          flatLinks.push(item);
          if (item.children) flatten(item.children);
        }
      };
      flatten(links);
      
      const targetLink = flatLinks.find(l => l.id === showFileSelectorFor);
      if (targetLink && !targetLink.title) {
        updateLink(showFileSelectorFor, 'title', file.name.split('/').pop() || file.name);
      }
    }
    setShowFileSelectorFor(null);
  };

  const handleFolderSelect = (folderName: string, filesInFolder: FileItem[]) => {
    const rootName = folderName.split('/').pop() || folderName;
    const rootLink: LinkItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 10),
      title: rootName,
      type: 'folder',
      children: []
    };

    filesInFolder.forEach(file => {
      // Ensure file is actually inside this folder
      if (!file.name.startsWith(folderName + '/')) return;
      
      const relativePath = file.name.substring(folderName.length + 1); // e.g. "28) SSC/file.pdf"
      const parts = relativePath.split('/'); 
      
      let currentFolder = rootLink;
      
      // Traverse and create subfolders if they don't exist
      for (let i = 0; i < parts.length - 1; i++) {
        const folderPart = parts[i];
        let nextFolder = currentFolder.children?.find(c => c.title === folderPart && c.type === 'folder');
        
        if (!nextFolder) {
          nextFolder = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 10),
            title: folderPart,
            type: 'folder',
            children: []
          };
          if (!currentFolder.children) currentFolder.children = [];
          currentFolder.children.push(nextFolder);
        }
        currentFolder = nextFolder;
      }
      
      // Add the file to the current (deepest) folder
      const fileName = parts[parts.length - 1];
      if (!currentFolder.children) currentFolder.children = [];
      currentFolder.children.push({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 10),
        title: fileName,
        url: file.url,
        description: '',
        type: 'link',
        fileType: file.type,
        fileSize: file.size
      });
      });
    });

    const sortTree = (node: LinkItem) => {
      if (node.children) {
        node.children.sort((a, b) => {
          if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
          return (a.title || '').localeCompare(b.title || '', undefined, { numeric: true, sensitivity: 'base' });
        });
        node.children.forEach(sortTree);
      }
    };
    sortTree(rootLink);

    setLinks(prev => [...prev, rootLink]);
    setShowFolderSelector(false);
  };

  if (loading) {
    return <AdminWrapper><div className="p-6">Loading...</div></AdminWrapper>;
  }

  if (!id || !item) {
    return <AdminWrapper><div className="p-6">Item not found. Please go back to pages.</div></AdminWrapper>;
  }

  return (
    <AdminWrapper>
      {showFileSelectorFor && (
        <TreeFileSelector 
          mode="file"
          title="Select a File"
          onSelectFile={handleFileSelect} 
          onClose={() => setShowFileSelectorFor(null)} 
        />
      )}
      {showFolderSelector && (
        <TreeFileSelector
          mode="both"
          title="Import Folder or Files"
          onSelectFolder={handleFolderSelect}
          onSelectFile={(file) => {
            const fileName = file.name.split('/').pop() || file.name;
            const newLink: LinkItem = {
              id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
              title: fileName,
              url: file.url,
              description: '',
              type: 'link',
              fileType: file.type,
              fileSize: file.size
            };
            setLinks(prev => [...prev, newLink]);
            setShowFolderSelector(false);
            alert(`Successfully imported 1 file!`);
          }}
          onClose={() => setShowFolderSelector(false)}
        />
      )}
      
      <div className="flex flex-col gap-6 relative min-h-[400px]">
        <OperationStatusOverlay status={operationStatus} />
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Edit {item.layout === 'links' ? 'Links' : 'Content'}: {item.title}</h1>
            <p className="text-sm text-text-muted">Slug: /{item.slug}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/admin/pages')}
              className="px-4 py-2 border border-border-main text-sm font-bold"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-accent text-primary font-bold py-2 px-6 rounded-sm hover:bg-yellow-400 transition-colors"
            >
              Save {item.layout === 'links' ? 'Links' : 'Content'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-border-main p-4 sm:p-6">
          {item.layout === 'links' ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <label className="block text-sm font-bold text-primary">Page Links</label>
                  {links.length > 0 && (
                    <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedLinks.size === links.length && links.length > 0}
                        onChange={selectAll}
                        className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                      />
                      Select All
                    </label>
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedLinks.size > 0 && (
                    <button 
                      onClick={deleteSelected}
                      className="flex items-center gap-2 text-sm font-bold bg-red-100 text-red-800 px-3 py-1.5 rounded hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={14} /> Delete Selected ({selectedLinks.size})
                    </button>
                  )}
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleBulkImport}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-sm font-bold bg-green-100 text-green-800 px-3 py-1.5 rounded hover:bg-green-200 transition-colors"
                  >
                    <Upload size={14} /> Bulk Import
                  </button>
                  <button 
                    onClick={() => setShowFolderSelector(true)}
                    className="flex items-center gap-2 text-sm font-bold bg-blue-100 text-blue-800 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors"
                  >
                    Import Folder
                  </button>
                  <button 
                    onClick={handleAddLink}
                    className="flex items-center gap-2 text-sm font-bold bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
                  >
                    <PlusCircle size={14} /> Add Link
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                {links.length === 0 ? (
                  <div className="border border-dashed border-gray-300 p-8 text-center text-gray-500 rounded-lg">
                    No links added yet. Click &quot;Add Link&quot; to create one.
                  </div>
                ) : (
                  <div className="border border-border-main rounded bg-white overflow-hidden">
                    {links.map(link => {
                      const renderLinkNode = (node: LinkItem, depth: number = 0) => {
                        const isFolder = node.type === 'folder';
                        const isImportedFile = node.type === 'link' && node.fileType;
                        
                        if (isFolder || isImportedFile) {
                          return (
                            <div key={node.id} className="flex flex-col border-b border-border-main last:border-b-0">
                              <div 
                                className={`flex items-center p-3 gap-3 hover:bg-gray-50 transition-colors ${selectedLinks.has(node.id) ? 'bg-blue-50/50' : 'bg-white'}`}
                              >
                                <div style={{ width: `${depth * 24}px` }} className="shrink-0" />
                                <input 
                                  type="checkbox" 
                                  checked={selectedLinks.has(node.id)}
                                  onChange={() => toggleSelectLink(node.id)}
                                  className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 shrink-0"
                                />
                                {isFolder ? (
                                  <div className="flex items-center gap-2 flex-1 cursor-pointer select-none" onClick={() => toggleFolderExpand(node.id)}>
                                     {expandedFolders.has(node.id) ? <ChevronDown size={18} className="text-gray-500 shrink-0" /> : <ChevronRight size={18} className="text-gray-500 shrink-0" />}
                                     <Folder size={20} className="text-blue-600 shrink-0" />
                                     <span className="font-bold text-primary uppercase text-sm truncate">{node.title}</span>
                                     <span className="text-text-muted text-xs shrink-0">({node.children?.length || 0} items)</span>
                                  </div>
                                ) : (
                                   <div className="flex items-center gap-3 flex-1 min-w-0">
                                     <div className="w-[18px] shrink-0" />
                                     {node.fileType === 'Image' ? <ImageIcon size={20} className="text-blue-500 shrink-0" /> : <FileText size={20} className="text-red-500 shrink-0" />}
                                     <span className="font-bold text-primary text-sm truncate">{node.title}</span>
                                   </div>
                                )}
                                
                                {!isFolder && (
                                  <>
                                    <div className="w-24 text-text-muted text-xs hidden sm:block shrink-0">Document</div>
                                    <div className="w-20 text-text-muted text-xs text-right hidden sm:block shrink-0">{formatSize(node.fileSize || 0)}</div>
                                  </>
                                )}
                              </div>
                              {isFolder && expandedFolders.has(node.id) && node.children && node.children.length > 0 && (
                                <div className="flex flex-col w-full bg-white">
                                  {node.children.map(child => renderLinkNode(child, depth + 1))}
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Original Manual Link Rendering
                        return (
                          <div key={node.id} className="flex flex-col gap-2 p-4 border-b border-border-main last:border-b-0 bg-gray-50">
                            <div 
                              className={`flex gap-4 items-start relative group`}
                              style={{ marginLeft: `${depth * 24}px` }}
                            >
                              <div className="pt-2 flex flex-col gap-3 items-center">
                                <input 
                                  type="checkbox" 
                                  checked={selectedLinks.has(node.id)}
                                  onChange={() => toggleSelectLink(node.id)}
                                  className="rounded border-gray-300 text-primary focus:ring-primary mt-1 w-4 h-4"
                                />
                                <div className="cursor-grab text-gray-400 hover:text-gray-600">
                                  <GripVertical size={20} />
                                </div>
                              </div>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={isFolder ? "md:col-span-2" : ""}>
                                  <label className="block text-xs font-bold text-gray-600 mb-1">{isFolder ? 'Folder Name' : 'Link Title'}</label>
                                  <input 
                                    type="text" 
                                    className={`w-full border border-border-main p-2 text-sm bg-white ${isFolder ? 'font-bold' : ''}`} 
                                    value={node.title}
                                    placeholder={isFolder ? "Folder Name" : "e.g. Study Materials 2026"}
                                    onChange={(e) => updateLink(node.id, 'title', e.target.value)}
                                  />
                                </div>
                                {!isFolder && (
                                  <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1 flex justify-between">
                                      URL / Target
                                      <button 
                                        onClick={() => setShowFileSelectorFor(node.id)}
                                        className="text-primary hover:text-secondary flex items-center gap-1"
                                        title="Select uploaded file"
                                      >
                                        <FileSearch size={12} /> Select File
                                      </button>
                                    </label>
                                    <input 
                                      type="text" 
                                      className="w-full border border-border-main p-2 text-sm bg-white" 
                                      value={node.url}
                                      placeholder="https://..."
                                      onChange={(e) => updateLink(node.id, 'url', e.target.value)}
                                    />
                                  </div>
                                )}
                                {!isFolder && (
                                  <div className="md:col-span-2">
                                    {node.description || showDesc.has(node.id) ? (
                                      <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1 flex justify-between">
                                          Description (Optional)
                                          <button 
                                            type="button" 
                                            onClick={() => { updateLink(node.id, 'description', ''); toggleDesc(node.id); }} 
                                            className="text-red-500 hover:underline font-normal"
                                          >
                                            Remove
                                          </button>
                                        </label>
                                        <input 
                                          type="text" 
                                          className="w-full border border-border-main p-2 text-sm bg-white" 
                                          value={node.description || ''}
                                          placeholder="Brief description for this link..."
                                          onChange={(e) => updateLink(node.id, 'description', e.target.value)}
                                        />
                                      </div>
                                    ) : (
                                      <button 
                                        type="button"
                                        onClick={() => toggleDesc(node.id)}
                                        className="text-primary hover:underline text-xs font-bold"
                                      >
                                        + Add Description
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                              <button 
                                onClick={() => removeLink(node.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                                title={isFolder ? "Remove Folder" : "Remove Link"}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            {isFolder && node.children && node.children.length > 0 && (
                              <div className="flex flex-col gap-2">
                                {node.children.map(child => renderLinkNode(child, depth + 1))}
                              </div>
                            )}
                          </div>
                        );
                      };
                      return renderLinkNode(link, 0);
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Page Content</label>
              <div className="border border-border-main min-h-[400px]">
                <RichTextEditor 
                  value={content} 
                  onChange={setContent} 
                  placeholder="Enter the main content here..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
