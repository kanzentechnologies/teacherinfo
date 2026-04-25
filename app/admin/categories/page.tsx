'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Category, getCategories, saveCategories, deleteCategory } from '@/lib/categoryStore';

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategories(await getCategories());
    };
    fetchCategories();
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (autoSlug) {
      setSlug(generateSlug(newName));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setAutoSlug(false);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setParentId('');
    setAutoSlug(true);
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setParentId(category.parentId || '');
    setAutoSlug(false);
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!name || !slug) return;
    
    let updated;
    if (editingId) {
      updated = categories.map(c => 
        c.id === editingId 
          ? { ...c, name, slug, description, parentId: parentId || null }
          : c
      );
    } else {
      const newCategory = {
        id: crypto.randomUUID(),
        name,
        slug,
        description,
        parentId: parentId || null,
        count: 0
      };
      updated = [...categories, newCategory];
    }
    
    await saveCategories(updated);
    setCategories(updated);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
      const updated = categories.filter((c: Category) => c.id !== id);
      setCategories(updated);
    }
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Content Categories</h1>
            <p className="text-sm text-text-muted mt-1">Categories (or Folders) are used to group together related posts and updates. For example, &quot;Study Materials&quot; or &quot;Job Updates&quot;. Once you create a Category, you can add it to the Navigation Menu and assign Posts to it.</p>
          </div>
          <button 
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
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
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Category Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={handleNameChange}
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="e.g. Study Materials" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-bold text-primary">Slug</label>
                  <span className="text-xs text-gray-500">{autoSlug ? '(Auto-generated)' : '(Manual)'}</span>
                </div>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={handleSlugChange}
                  className="w-full border border-border-main p-2 text-sm bg-gray-50 focus:bg-white" 
                  placeholder="e.g. study-materials" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Parent Category</label>
                <select 
                  className="w-full border border-border-main p-2 text-sm bg-white"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <option value="">None (Top Level)</option>
                  {categories.map(c => (
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
                <button type="button" onClick={handleSave} className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Category</button>
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
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-hover-bg">
                    <td className="px-4 py-3 font-bold text-primary">{category.name}</td>
                    <td className="px-4 py-3 text-text-muted">{category.slug}</td>
                    <td className="px-4 py-3 text-text-muted">
                      <span className="bg-gray-100 px-2 py-1 rounded-sm border border-gray-200">{category.count}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a href={`/admin/posts?category=${category.slug}`} className="text-secondary hover:underline mr-3 inline-flex items-center gap-1 font-bold">Manage Posts</a>
                      <button onClick={() => handleEdit(category)} className="text-secondary hover:underline mr-3 inline-flex items-center gap-1"><Edit size={14}/> Edit</button>
                      <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:underline inline-flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {categories.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No categories found.
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
