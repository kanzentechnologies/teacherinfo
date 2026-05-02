'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { getPageById, savePage, PageItem } from '@/lib/pageStore';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';

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

  const removeLink = (linkId: string) => {
    setLinks(links.filter(l => l.id !== linkId));
  };

  if (loading) {
    return <AdminWrapper><div className="p-6">Loading...</div></AdminWrapper>;
  }

  if (!id || !item) {
    return <AdminWrapper><div className="p-6">Item not found. Please go back to pages.</div></AdminWrapper>;
  }

  return (
    <AdminWrapper>
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
                <label className="block text-sm font-bold text-primary">Page Links</label>
                <button 
                  onClick={handleAddLink}
                  className="flex items-center gap-2 text-sm font-bold bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200"
                >
                  <PlusCircle size={14} /> Add Link
                </button>
              </div>
              
              <div className="flex flex-col gap-3">
                {links.length === 0 ? (
                  <div className="border border-dashed border-gray-300 p-8 text-center text-gray-500 rounded-lg">
                    No links added yet. Click &quot;Add Link&quot; to create one.
                  </div>
                ) : (
                  links.map((link, index) => (
                    <div key={link.id} className="border border-border-main bg-gray-50 p-4 flex gap-4 items-start rounded relative group">
                      <div className="pt-2 cursor-grab text-gray-400 hover:text-gray-600">
                        <GripVertical size={20} />
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
                          <label className="block text-xs font-bold text-gray-600 mb-1">URL / Target</label>
                          <input 
                            type="text" 
                            className="w-full border border-border-main p-2 text-sm bg-white" 
                            value={link.url}
                            placeholder="https://..."
                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-600 mb-1">Description (Optional)</label>
                          <input 
                            type="text" 
                            className="w-full border border-border-main p-2 text-sm bg-white" 
                            value={link.description || ''}
                            placeholder="Brief description for this link..."
                            onChange={(e) => updateLink(link.id, 'description', e.target.value)}
                          />
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
