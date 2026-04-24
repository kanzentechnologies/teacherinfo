'use client';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { useState, useEffect } from 'react';
import { getPages, Page, deletePage } from '@/lib/pageStore';

export default function PagesManagementPage() {
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      setPages(await getPages());
    };
    fetchPages();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      await deletePage(id);
      const updatedPages = pages.filter((p: Page) => p.id !== id);
      setPages(updatedPages);
    }
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Manage Pages</h1>
            <p className="text-sm text-text-muted">Manage static pages like About, Contact, etc.</p>
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
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-hover-bg">
                    <td className="px-4 py-3 font-medium text-text-main">{page.title}</td>
                    <td className="px-4 py-3 text-text-muted">{page.slug.startsWith('/') ? page.slug : `/${page.slug}`}</td>
                    <td className="px-4 py-3 text-text-muted">{page.date}</td>
                    <td className="px-4 py-3">
                      {page.status === 'Published' ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-sm border border-green-200">Published</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-sm border border-yellow-200">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/pages/${page.id}/edit`} className="text-secondary hover:underline mr-3">Edit</Link>
                      <button onClick={() => handleDelete(page.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No pages found. Create one.
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
