'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, Edit, Trash2, FileEdit } from 'lucide-react';
import { getPages, savePage, deletePage, PageItem } from '@/lib/pageStore';

export default function PagesManagement() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [customSlug, setCustomSlug] = useState('');

  const fetchPages = async () => {
    setPages(await getPages());
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const generateSlug = (t: string) => {
    return t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const slug = customSlug || generateSlug(title);

    const newPage: PageItem = {
      id: editingId || Date.now().toString(),
      title,
      slug,
      content: '', // Edited separately
      status: 'Published'
    };

    if (editingId) {
      const existing = pages.find(p => p.id === editingId);
      if (existing) {
        newPage.content = existing.content;
      }
    }

    try {
      await savePage(newPage);
      await fetchPages();
      resetForm();
    } catch (e: any) {
      alert("Error saving page: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      await deletePage(id);
      await fetchPages();
    } catch (e: any) {
      alert("Error deleting page: " + e.message);
    }
  };

  const handleEdit = (page: PageItem) => {
    setTitle(page.title);
    setCustomSlug(page.slug);
    setEditingId(page.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setTitle('');
    setCustomSlug('');
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">All Pages Management</h1>
            <p className="text-sm text-text-muted">Create and manage content for your website pages.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Create Page
          </button>
        </div>

        {isAdding && (
          <div className="bg-white border border-border-main p-6">
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">
              {editingId ? 'Edit Page Details' : 'Add New Page'}
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Page Title</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="e.g. About Us" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-primary mb-1">URL Slug (leave empty to auto-generate)</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="/about-us" 
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-border-main text-sm font-bold text-text-muted">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Page</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-border-main overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-primary border-b border-border-main">
              <tr>
                <th className="p-4 font-bold">Title</th>
                <th className="p-4 font-bold">Path / Slug</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-text-muted">No pages found. Create one.</td></tr>
              ) : pages.map(page => (
                <tr key={page.id} className="border-b border-border-main hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-text-main">{page.title}</td>
                  <td className="p-4 font-mono text-xs text-secondary">/{page.slug}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">{page.status}</span>
                  </td>
                  <td className="p-4 flex gap-3 justify-end items-center">
                    <Link href={`/admin/content/${page.id}`} className="text-secondary hover:underline flex items-center gap-1 font-bold">
                      <FileEdit size={14} /> Edit Content
                    </Link>
                    <button onClick={() => handleEdit(page)} className="text-text-muted hover:text-primary flex items-center gap-1">
                      <Edit size={14} /> Edit Details
                    </button>
                    <button onClick={() => handleDelete(page.id)} className="text-red-500 hover:underline flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminWrapper>
  );
}
