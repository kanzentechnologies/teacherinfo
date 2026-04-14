'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { getPages, savePages, StaticPage } from '@/lib/pageStore';

export default function PagesManagementPage() {
  const [pages, setPages] = useState<StaticPage[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPages(getPages());
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    const newPages = pages.filter(p => p.id !== id);
    setPages(newPages);
    savePages(newPages);
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Manage Pages</h1>
            <p className="text-sm text-text-muted">Manage static pages like About, Privacy Policy, etc.</p>
          </div>
          <Link 
            href="/admin/pages/new" 
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Create New Page
          </Link>
        </div>

        <div className="bg-white border border-border-main">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-border-main text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Page Title</th>
                  <th className="px-4 py-3 font-medium">Slug / Path</th>
                  <th className="px-4 py-3 font-medium">Last Updated</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted">No pages found. Create your first page!</td>
                  </tr>
                ) : (
                  pages.map((page) => (
                    <tr key={page.id} className="hover:bg-hover-bg">
                      <td className="px-4 py-3 font-medium text-text-main">{page.title}</td>
                      <td className="px-4 py-3 text-text-muted">/{page.slug}</td>
                      <td className="px-4 py-3 text-text-muted">{page.lastUpdated}</td>
                      <td className="px-4 py-3">
                        {page.status === 'Published' ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-sm border border-green-200">Published</span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-sm border border-yellow-200">Draft</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-3">
                          <Link href={`/p/${page.slug}`} target="_blank" className="text-gray-500 hover:text-primary" title="View Page">
                            <Eye size={18} />
                          </Link>
                          <Link href={`/admin/pages/${page.id}/edit`} className="text-secondary hover:text-primary" title="Edit Page">
                            <Edit size={18} />
                          </Link>
                          <button onClick={() => handleDelete(page.id)} className="text-red-600 hover:text-red-800" title="Delete Page">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
