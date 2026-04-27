'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { getNavItems, saveNavItem, NavItem } from '@/lib/navStore';

export default function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [item, setItem] = useState<NavItem | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      const items = await getNavItems();
      const found = items.find(i => i.id === id);
      if (found) {
        setItem(found);
        setContent(found.content || '');
      }
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  const handleSave = async () => {
    if (!item) return;
    try {
      await saveNavItem({ ...item, content });
      alert('Content saved successfully!');
      router.push('/admin/navbar');
    } catch (err: any) {
      alert('Error saving content: ' + err.message);
    }
  };

  if (loading) {
    return <AdminWrapper><div className="p-6">Loading...</div></AdminWrapper>;
  }

  if (!item) {
    return <AdminWrapper><div className="p-6">Item not found.</div></AdminWrapper>;
  }

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Edit Content: {item.title}</h1>
            <p className="text-sm text-text-muted">Slug: /{item.slug}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/admin/navbar')}
              className="px-4 py-2 border border-border-main text-sm font-bold"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-accent text-primary font-bold py-2 px-6 rounded-sm hover:bg-yellow-400 transition-colors"
            >
              Save Content
            </button>
          </div>
        </div>

        <div className="bg-white border border-border-main p-4 sm:p-6">
          <label className="block text-sm font-bold text-primary mb-2">Page Content</label>
          <div className="border border-border-main min-h-[400px]">
            <RichTextEditor 
              value={content} 
              onChange={setContent} 
              placeholder="Enter the main content here..."
            />
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
