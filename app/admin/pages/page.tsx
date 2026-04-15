'use client';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';

export default function PagesManagementPage() {
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
                {[
                  { id: 1, title: 'About Us', slug: '/about', date: '2024-01-15', status: 'Published' },
                  { id: 2, title: 'Contact Us', slug: '/contact', date: '2024-02-20', status: 'Published' },
                  { id: 3, title: 'Privacy Policy', slug: '/privacy-policy', date: '2023-11-05', status: 'Published' },
                  { id: 4, title: 'Terms of Service', slug: '/terms', date: '2023-11-05', status: 'Draft' },
                ].map((page) => (
                  <tr key={page.id} className="hover:bg-hover-bg">
                    <td className="px-4 py-3 font-medium text-text-main">{page.title}</td>
                    <td className="px-4 py-3 text-text-muted">{page.slug}</td>
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
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
