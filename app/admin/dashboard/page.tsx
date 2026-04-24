'use client';

import Link from 'next/link';
import { PlusCircle, FileText, Users, Settings, Bell, BarChart } from 'lucide-react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { useEffect, useState } from 'react';
import { getPages } from '@/lib/pageStore';
import { getCategories } from '@/lib/categoryStore';
import { getContacts } from '@/lib/contactStore';
import { getServices } from '@/lib/serviceStore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pages: 0, categories: 0, contacts: 0, services: 0 });
  const [recentPages, setRecentPages] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [pages, cats, contacts, services] = await Promise.all([
        getPages(),
        getCategories(),
        getContacts(),
        getServices()
      ]);
      setStats({
        pages: pages.length,
        categories: cats.length,
        contacts: contacts.length,
        services: services.length,
      });
      setRecentPages(pages.slice(0, 5));
    };
    fetchStats();
  }, []);

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-sm text-text-muted">Welcome back, Administrator</p>
          </div>
          <Link 
            href="/admin/pages/new" 
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Create New Page
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Pages', value: stats.pages, icon: FileText, color: 'text-blue-600' },
            { label: 'Total Categories', value: stats.categories, icon: Users, color: 'text-green-600' },
            { label: 'Total Direct Contacts', value: stats.contacts, icon: Bell, color: 'text-orange-600' },
            { label: 'Total Services', value: stats.services, icon: BarChart, color: 'text-purple-600' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white border border-border-main p-4 flex items-center gap-4">
                <div className={`p-3 bg-gray-100 rounded-full ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-sm text-text-muted font-medium">{stat.label}</div>
                  <div className="text-2xl font-bold text-text-main">{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-border-main">
          <div className="bg-gray-100 border-b border-border-main px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-primary">Recent Pages</h3>
            <Link href="/admin/pages" className="text-sm text-secondary hover:underline">View All Pages</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-border-main text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {recentPages.map((page) => (
                  <tr key={page.id} className="hover:bg-hover-bg">
                    <td className="px-4 py-3 font-medium text-text-main">{page.title}</td>
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
