'use client';

import React, { useState } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const mockCategories = [
  { id: 1, name: 'Useful Links', slug: 'useful-links', parent: null, count: 12 },
  { id: 2, name: 'Income Tax', slug: 'income-tax', parent: null, count: 5 },
  { id: 3, name: 'GO’s & Proceedings', slug: 'gos-and-proceedings', parent: null, count: 45 },
  { id: 4, name: 'Softwares', slug: 'softwares', parent: null, count: 8 },
  { id: 5, name: 'Forms', slug: 'forms', parent: null, count: 24 },
  { id: 6, name: 'Academics', slug: 'academics', parent: null, count: 156 },
  { id: 7, name: 'Services', slug: 'services', parent: null, count: 10 },
];

export default function CategoriesManagementPage() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Manage Categories</h1>
            <p className="text-sm text-text-muted">Organize content into categories</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Add Category
          </button>
        </div>

        {isAdding && (
          <div className="bg-white border border-border-main p-6">
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">Add New Category</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Category Name</label>
                <input type="text" className="w-full border border-border-main p-2 text-sm" placeholder="e.g. Study Materials" />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Slug</label>
                <input type="text" className="w-full border border-border-main p-2 text-sm" placeholder="e.g. study-materials" />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Parent Category</label>
                <select className="w-full border border-border-main p-2 text-sm bg-white">
                  <option value="">None (Top Level)</option>
                  {mockCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Description</label>
                <input type="text" className="w-full border border-border-main p-2 text-sm" placeholder="Brief description" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border border-border-main text-sm font-bold">Cancel</button>
                <button type="button" className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Category</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-border-main">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-border-main text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Posts Count</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {mockCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-hover-bg">
                    <td className="px-4 py-3 font-bold text-primary">{category.name}</td>
                    <td className="px-4 py-3 text-text-muted">{category.slug}</td>
                    <td className="px-4 py-3 text-text-muted">
                      <span className="bg-gray-100 px-2 py-1 rounded-sm border border-gray-200">{category.count}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-secondary hover:underline mr-3 inline-flex items-center gap-1"><Edit size={14}/> Edit</button>
                      <button className="text-red-600 hover:underline inline-flex items-center gap-1"><Trash2 size={14}/> Delete</button>
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
