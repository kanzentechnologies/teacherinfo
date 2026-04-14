'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { getCategories, saveCategories, Category } from '@/lib/categoryStore';

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategories(getCategories());
  }, []);

  const resetForm = () => {
    setName('');
    setSlug('');
    setParentId(null);
    setDescription('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory: Category = {
      id: editingId || Date.now().toString(),
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      parentId,
      description
    };

    let newCategories = [...categories];
    if (editingId) {
      newCategories = newCategories.map(c => c.id === editingId ? newCategory : c);
    } else {
      newCategories.push(newCategory);
    }

    setCategories(newCategories);
    saveCategories(newCategories);
    resetForm();
  };

  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setSlug(cat.slug);
    setParentId(cat.parentId);
    setDescription(cat.description);
    setEditingId(cat.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure?')) return;
    const newCategories = categories.filter(c => c.id !== id);
    setCategories(newCategories);
    saveCategories(newCategories);
  };

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
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Category Name</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="e.g. Study Materials" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Slug</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="e.g. study-materials" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Parent Category</label>
                <select 
                  className="w-full border border-border-main p-2 text-sm bg-white"
                  value={parentId || ''}
                  onChange={(e) => setParentId(e.target.value || null)}
                >
                  <option value="">None (Top Level)</option>
                  {categories.filter(c => c.id !== editingId).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Description</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="Brief description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-border-main text-sm font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Category</button>
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
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-hover-bg">
                    <td className="px-4 py-3 font-bold text-primary">{category.name}</td>
                    <td className="px-4 py-3 text-text-muted">{category.slug}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(category)} className="text-secondary hover:underline mr-3 inline-flex items-center gap-1"><Edit size={14}/> Edit</button>
                      <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:underline inline-flex items-center gap-1"><Trash2 size={14}/> Delete</button>
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
