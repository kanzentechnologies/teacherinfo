'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { getPageById, savePage, PageItem } from '@/lib/pageStore';
import { PlusCircle, Trash2, GripVertical, FileSearch, Upload } from 'lucide-react';
import * as xlsx from 'xlsx';
import { FileSelector } from '@/components/admin/FileSelector';
import { FolderSelector } from '@/components/admin/FolderSelector';
import { FileItem } from '@/lib/fileStore';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export default function EditContentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [item, setItem] = useState<PageItem | null>(null);
  const [content, setContent] = useState('');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFileSelectorFor, setShowFileSelectorFor] = useState<string | null>(null);
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set());
  const [showDesc, setShowDesc] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const finalContent = item.layout === 'links' ? JSON.stringify(links) : content;
      await savePage({ ...item, content: finalContent });
      alert('Content saved successfully!');
      router.push('/admin/pages');
    } catch (err: any) {
      alert('Error saving content: ' + err.message);
    }
  };

  const handleAddLink = () => {
    setLinks([...links, { id: Date.now().toString(), title: '', url: '', description: '' }]);
  };

  const updateLink = (linkId: string, field: keyof LinkItem, value: string) => {
    setLinks(links.map(l => l.id === linkId ? { ...l, [field]: value } : l));
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

  const removeLink = (linkId: string) => {
    setLinks(links.filter(l => l.id !== linkId));
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

  const deleteSelected = () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedLinks.size} links?`)) return;
    setLinks(links.filter(l => !selectedLinks.has(l.id)));
    setSelectedLinks(new Set());
  };

  const selectAll = () => {
    if (selectedLinks.size === links.length) {
      setSelectedLinks(new Set());
    } else {
      setSelectedLinks(new Set(links.map(l => l.id)));
    }
  };

  const handleFileSelect = (file: FileItem) => {
    if (showFileSelectorFor) {
      updateLink(showFileSelectorFor, 'url', file.url);
      
      // Optionally pre-fill title if empty
      const targetLink = links.find(l => l.id === showFileSelectorFor);
      if (targetLink && !targetLink.title) {
        updateLink(showFileSelectorFor, 'title', file.name);
      }
    }
    setShowFileSelectorFor(null);
  };

  const handleFolderSelect = (folderPath: string, filesInFolder: FileItem[]) => {
    const newLinks = filesInFolder.map(file => {
      // Extract base filename (remove folder path)
      const fileName = file.name.substring(folderPath.length + 1);
      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
        title: fileName,
        url: file.url,
        description: ''
      };
    });
    
    // Alphabetically sort the incoming links by title
    newLinks.sort((a, b) => a.title.localeCompare(b.title));

    setLinks(prev => [...prev, ...newLinks]);
    setShowFolderSelector(false);
    alert(`Successfully imported ${newLinks.length} files from ${folderPath}!`);
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
        <FileSelector 
          onSelect={handleFileSelect} 
          onClose={() => setShowFileSelectorFor(null)} 
        />
      )}
      {showFolderSelector && (
        <FolderSelector
          onSelect={handleFolderSelect}
          onClose={() => setShowFolderSelector(false)}
        />
      )}
      
      <div className="flex flex-col gap-6">
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
                  links.map((link, index) => (
                    <div key={link.id} className={`border p-4 flex gap-4 items-start rounded relative group ${selectedLinks.has(link.id) ? 'border-primary bg-blue-50' : 'border-border-main bg-gray-50'}`}>
                      <div className="pt-2 flex flex-col gap-3 items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedLinks.has(link.id)}
                          onChange={() => toggleSelectLink(link.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary mt-1 w-4 h-4"
                        />
                        <div className="cursor-grab text-gray-400 hover:text-gray-600">
                          <GripVertical size={20} />
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Link Title</label>
                          <input 
                            type="text" 
                            className="w-full border border-border-main p-2 text-sm bg-white" 
                            value={link.title}
                            placeholder="e.g. Study Materials 2026"
                            onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1 flex justify-between">
                            URL / Target
                            <button 
                              onClick={() => setShowFileSelectorFor(link.id)}
                              className="text-primary hover:text-secondary flex items-center gap-1"
                              title="Select uploaded file"
                            >
                              <FileSearch size={12} /> Select File
                            </button>
                          </label>
                          <input 
                            type="text" 
                            className="w-full border border-border-main p-2 text-sm bg-white" 
                            value={link.url}
                            placeholder="https://..."
                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          {link.description || showDesc.has(link.id) ? (
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1 flex justify-between">
                                Description (Optional)
                                <button 
                                  type="button" 
                                  onClick={() => { updateLink(link.id, 'description', ''); toggleDesc(link.id); }} 
                                  className="text-red-500 hover:underline font-normal"
                                >
                                  Remove
                                </button>
                              </label>
                              <input 
                                type="text" 
                                className="w-full border border-border-main p-2 text-sm bg-white" 
                                value={link.description || ''}
                                placeholder="Brief description for this link..."
                                onChange={(e) => updateLink(link.id, 'description', e.target.value)}
                              />
                            </div>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => toggleDesc(link.id)}
                              className="text-primary hover:underline text-xs font-bold"
                            >
                              + Add Description
                            </button>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeLink(link.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        title="Remove Link"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
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
