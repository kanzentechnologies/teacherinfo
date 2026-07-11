'use client';

import Link from 'next/link';
import { 
  PlusCircle, FileText, Users, Bell, 
  Layout, FolderTree, Image as ImageIcon, Settings, 
  ArrowRight, Activity
} from 'lucide-react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { useEffect, useState } from 'react';
import { getNavItems } from '@/lib/navStore';
import { getPages } from '@/lib/pageStore';
import { getContacts } from '@/lib/contactStore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pages: 0, items: 0, contacts: 0 });
  const [recentItems, setRecentItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [navItems, pages, contacts] = await Promise.all([
        getNavItems(),
        getPages(),
        getContacts()
      ]);
      setStats({
        pages: pages.length,
        items: navItems.length,
        contacts: contacts.length,
      });
      setRecentItems(pages.slice(0, 5));
    };
    fetchStats();
  }, []);

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="bg-white border border-border-main p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-sm shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">Admin Dashboard</h1>
            <p className="text-sm text-text-muted">Welcome back! Here's an overview of your portal today.</p>
          </div>
          <Link 
            href="/admin/navbar" 
            className="bg-accent text-primary font-bold py-2.5 px-5 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm shadow-sm whitespace-nowrap"
          >
            <PlusCircle size={18} />
            Manage Content
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Pages', value: stats.pages, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'Navigation Items', value: stats.items, icon: FolderTree, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
            { label: 'Direct Contacts', value: stats.contacts, icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`bg-white border ${stat.border} p-5 rounded-sm shadow-sm flex items-center gap-4 transition-all hover:shadow-md`}>
                <div className={`p-3.5 ${stat.bg} rounded-full ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary leading-none mb-1">{stat.value}</div>
                  <div className="text-sm text-text-muted font-medium">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area: Recent Pages */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white border border-border-main rounded-sm shadow-sm flex flex-col h-full">
              <div className="border-b border-border-main px-6 py-4 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-secondary" />
                  <h3 className="font-bold text-primary">Recent Pages</h3>
                </div>
                <Link href="/admin/pages" className="text-sm text-secondary hover:text-primary transition-colors font-medium flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="overflow-x-auto flex-grow">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white border-b border-border-main text-text-muted">
                    <tr>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-[11px]">Title</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-[11px]">Auto Slug</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-[11px]">Status</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-[11px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main">
                    <tr className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-3.5 font-medium text-text-main flex items-center gap-2">
                        Contact Us 
                        <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">System</span>
                      </td>
                      <td className="px-6 py-3.5 text-text-muted font-mono text-xs">/contact</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link href="/admin/contact" className="text-secondary hover:text-primary transition-colors font-medium">Edit</Link>
                      </td>
                    </tr>
                    {recentItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-3.5 font-medium text-text-main truncate max-w-[200px]" title={item.title}>{item.title}</td>
                        <td className="px-6 py-3.5 text-text-muted font-mono text-xs truncate max-w-[150px]">/{item.slug}</td>
                        <td className="px-6 py-3.5">
                          {item.status === 'Published' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Link href={`/admin/content-edit?id=${item.id}`} className="text-secondary hover:text-primary transition-colors font-medium">Edit</Link>
                        </td>
                      </tr>
                    ))}
                    {recentItems.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-text-muted">
                          No recent pages found. Create a new page to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Area: Quick Links */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-border-main rounded-sm shadow-sm h-full">
              <div className="border-b border-border-main px-6 py-4 bg-gray-50/50">
                <h3 className="font-bold text-primary">Quick Actions</h3>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {[
                  { title: 'Pages & Content', desc: 'Create and edit pages', icon: FileText, href: '/admin/pages', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { title: 'Navigation Menu', desc: 'Organize site structure', icon: Layout, href: '/admin/navbar', color: 'text-purple-600', bg: 'bg-purple-50' },
                  { title: 'File Manager', desc: 'Upload documents & PDFs', icon: ImageIcon, href: '/admin/files', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((link, i) => (
                  <Link key={i} href={link.href} className="flex items-start gap-4 p-3 rounded-sm hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
                    <div className={`p-2.5 rounded-sm ${link.bg} ${link.color} group-hover:scale-105 transition-transform`}>
                      <link.icon size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-primary text-sm mb-0.5 group-hover:text-secondary transition-colors">{link.title}</div>
                      <div className="text-xs text-text-muted">{link.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminWrapper>
  );
}
