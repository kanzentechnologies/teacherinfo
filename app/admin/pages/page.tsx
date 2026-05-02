'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, Edit, Trash2, FileEdit } from 'lucide-react';
import { getPages, savePage, deletePage, PageItem } from '@/lib/pageStore';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const generateId = () => Date.now().toString();

export default function PagesManagement() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [layout, setLayout] = useState<'content' | 'links'>('content');

  const fetchPages = async () => {
    const data = await getPages();
    setPages(data);
  };

  useEffect(() => {
    let mounted = true;
    const loadPages = async () => {
      const data = await getPages();
      if (mounted) {
        setPages(data);
      }
    };
    loadPages();
    return () => { mounted = false; };
  }, []);

  const generateSlug = (t: string) => {
    return t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    let slug = customSlug || generateSlug(title);
    // Remove leading and trailing slashes to ensure it matches properly
    slug = slug.replace(/^\/+/, '').replace(/\/+$/, '');

    const newPage: PageItem = {
      id: editingId || generateId(),
      title,
      slug,
      content: layout === 'links' ? '[]' : '', // default content
      status: 'Published',
      layout
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

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deletePage(itemToDelete);
      await fetchPages();
    } catch (e: any) {
      alert("Error deleting page: " + e.message);
    } finally {
      setItemToDelete(null);
    }
  };

  const handleEdit = (page: PageItem) => {
    setTitle(page.title);
    setCustomSlug(page.slug);
    setLayout(page.layout || 'content');
    setEditingId(page.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setTitle('');
    setCustomSlug('');
    setLayout('content');
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

              {!editingId && (
                <div className="md:col-span-2 mt-2">
                  <label className="block text-sm font-bold text-primary mb-2">Page Layout / Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded border border-border-main flex-1">
                      <input 
                        type="radio" 
                        name="layout" 
                        value="content"
                        checked={layout === 'content'}
                        onChange={() => setLayout('content')}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-sm font-medium">Rich Content Page</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded border border-border-main flex-1">
                      <input 
                        type="radio" 
                        name="layout" 
                        value="links"
                        checked={layout === 'links'}
                        onChange={() => setLayout('links')}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-sm font-medium">List View of Links</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
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
                <th className="p-4 font-bold">Layout</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-main hover:bg-gray-50 transition-colors bg-gray-50/50">
                <td className="p-4 font-bold text-text-main flex items-center gap-2">
                  Contact Us <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">System</span>
                </td>
                <td className="p-4 font-mono text-xs text-secondary">/contact</td>
                <td className="p-4">
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 py-1 px-2 rounded">System</span>
                </td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Published</span>
                </td>
                <td className="p-4 flex gap-3 justify-end items-center">
                  <Link href={`/admin/contact`} className="text-secondary hover:underline flex items-center gap-1 font-bold">
                    <FileEdit size={14} /> Edit Team Info
                  </Link>
                  <button disabled className="text-gray-300 flex items-center gap-1 cursor-not-allowed" title="System pages cannot be renamed">
                    <Edit size={14} /> Edit Details
                  </button>
                  <button disabled className="text-gray-300 flex items-center gap-1 cursor-not-allowed" title="System pages cannot be deleted">
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
              {pages.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-text-muted">No custom pages found. Create one.</td></tr>
              ) : pages.map(page => (
                <tr key={page.id} className="border-b border-border-main hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-text-main">{page.title}</td>
                  <td className="p-4 font-mono text-xs text-secondary">/{page.slug}</td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-primary bg-blue-50 py-1 px-2 rounded">
                      {page.layout === 'links' ? 'Links' : 'Content'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">{page.status}</span>
                  </td>
                  <td className="p-4 flex gap-3 justify-end items-center">
                    <Link href={`/admin/content-edit?id=${page.id}`} className="text-secondary hover:underline flex items-center gap-1 font-bold">
                      <FileEdit size={14} /> Edit {page.layout === 'links' ? 'Links' : 'Content'}
                    </Link>
                    <button onClick={() => handleEdit(page)} className="text-text-muted hover:text-primary flex items-center gap-1">
                      <Edit size={14} /> Edit Details
                    </button>
                    <button onClick={() => handleDeleteClick(page.id)} className="text-red-500 hover:underline flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Page"
        message="Are you sure you want to delete this page? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </AdminWrapper>
  );
}
