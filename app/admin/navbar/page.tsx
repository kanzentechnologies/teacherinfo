'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, GripVertical, Edit, Trash2, FileEdit } from 'lucide-react';
import { getNavTree, saveNavItems, deleteNavItem, NavItem, saveNavItem } from '@/lib/navStore';
import { Reorder } from 'motion/react';
import { supabase } from '@/lib/supabase';

export default function NavbarManagementPage() {
  const [menuItems, setMenuItems] = useState<NavItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [isPage, setIsPage] = useState(true);
  const [link, setLink] = useState('');
  const [parentId, setParentId] = useState<string>('');

  useEffect(() => {
    const fetchAll = async () => {
      setMenuItems(await getNavTree());
    };
    fetchAll();
  }, []);

  const handleSaveMenu = async (newMenu: NavItem[]) => {
    setMenuItems(newMenu);
    
    // Update order recursively
    const flatItems: NavItem[] = [];
    const flatten = (items: NavItem[], currentParentId: string | null) => {
      items.forEach((item, index) => {
        flatItems.push({
          ...item,
          parent_id: currentParentId,
          order_index: index,
          children: undefined // clear nested to save
        });
        if (item.children && item.children.length > 0) {
          flatten(item.children, item.id);
        }
      });
    };
    flatten(newMenu, null);
    
    try {
      await saveNavItems(flatItems);
      window.dispatchEvent(new Event('menuUpdated'));
    } catch (e: any) {
      alert("Error saving order: " + e.message);
    }
  };

  const handleReorderChildren = async (parentIdStr: string, newChildren: NavItem[]) => {
    const newMenu = menuItems.map(item => {
      if (item.id === parentIdStr) {
        return { ...item, children: newChildren };
      }
      return item;
    });
    await handleSaveMenu(newMenu);
  };

  const resetForm = () => {
    setTitle('');
    setCustomSlug('');
    setIsPage(true);
    setLink('');
    setParentId('');
    setIsAdding(false);
    setEditingId(null);
  };

  const generateSlug = (t: string) => {
    return t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const slug = customSlug || generateSlug(title);

    const newItem: NavItem = {
      id: editingId || (Math.floor(Math.random() * 100000000) + ""),
      title,
      slug,
      parent_id: parentId || null,
      is_page: isPage,
      content: editingId ? (menuItems.flatMap(m => [m, ...(m.children || [])]).find(m => m.id === editingId)?.content || '') : '',
      order_index: 0,
      status: 'Published',
      externalUrl: !isPage ? link : undefined,
    };

    let newMenu = [...menuItems];

    if (editingId) {
      // Edit existing locally
      let found = false;
      newMenu = newMenu.map(item => {
        if (item.id === editingId) {
          found = true;
          return { ...item, ...newItem, children: item.children };
        }
        if (item.children) {
          item.children = item.children.map(child => {
            if (child.id === editingId) {
              found = true;
              return { ...child, ...newItem };
            }
            return child;
          });
        }
        return item;
      });
      // also if parent changed, it breaks local tree, so just save and refetch
      try {
        await saveNavItem(newItem);
        setMenuItems(await getNavTree());
        window.dispatchEvent(new Event('menuUpdated'));
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      try {
        await saveNavItem(newItem);
        setMenuItems(await getNavTree());
        window.dispatchEvent(new Event('menuUpdated'));
      } catch (err: any) {
        alert(err.message);
      }
    }

    resetForm();
  };

  const handleDelete = async (id: string, isChild: boolean, parentIdStr?: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteNavItem(id);
      setMenuItems(await getNavTree());
      window.dispatchEvent(new Event('menuUpdated'));
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleEdit = (item: NavItem, parentIdStr?: string) => {
    setTitle(item.title);
    setCustomSlug(item.slug);
    setIsPage(item.is_page);
    setLink(item.externalUrl || '');
    setParentId(parentIdStr || '');
    setEditingId(item.id);
    setIsAdding(true);
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Pages & Menu Management</h1>
            <p className="text-sm text-text-muted">Create internal pages and organize them in the site navigation</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Create Page / Menu Link
          </button>
        </div>

        {isAdding && (
          <div className="bg-white border border-border-main p-6">
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">
              {editingId ? 'Edit Item' : 'Add New Item'}
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Title</label>
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
                <label className="block text-sm font-bold text-primary mb-1">Custom Slug (optional)</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="Auto-generated if left blank" 
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-1">Type</label>
                <select 
                  className="w-full border border-border-main p-2 text-sm bg-white"
                  value={isPage ? 'page' : 'link'}
                  onChange={(e) => setIsPage(e.target.value === 'page')}
                >
                  <option value="page">Internally Hosted Page (has content)</option>
                  <option value="link">External / Header Only Link</option>
                </select>
                <p className="text-xs text-text-muted mt-1">Select whether this is an editable page or just a link to somewhere else.</p>
              </div>

              {!isPage && (
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">URL / Path</label>
                  <input 
                    type="text" 
                    className="w-full border border-border-main p-2 text-sm" 
                    placeholder="https://..." 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required={!isPage}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-primary mb-1">Parent Menu (Optional)</label>
                <select 
                  className="w-full border border-border-main p-2 text-sm bg-white"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <option value="">None (Top Level)</option>
                  {menuItems.map(item => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-border-main text-sm font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Item</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-border-main">
          <div className="bg-gray-100 border-b border-border-main px-4 py-3">
            <h3 className="font-bold text-primary">Current Navigation Structure</h3>
            <p className="text-xs text-text-muted">Drag items using the handle to reorder</p>
          </div>
          <div className="p-4">
            <Reorder.Group axis="y" values={menuItems} onReorder={handleSaveMenu} className="space-y-2">
              {menuItems.map((item) => (
                <Reorder.Item key={item.id} value={item} className="border border-border-main bg-white select-none">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 cursor-grab active:cursor-grabbing p-1 hover:text-primary transition-colors">
                        <GripVertical size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-text-main">{item.title}</span>
                        <span className="ml-2 text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-sm border border-gray-200">
                          {item.is_page ? 'Internal Page' : 'External Link'}
                        </span>
                        <div className="text-xs text-secondary mt-0.5">/{item.slug}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.is_page && (
                        <Link href={`/admin/content/${item.id}`} className="text-secondary hover:underline text-sm flex items-center gap-1 font-bold">
                          <FileEdit size={14}/> Edit Content
                        </Link>
                      )}
                      <button onClick={() => handleEdit(item)} className="text-secondary hover:underline text-sm flex items-center gap-1"><Edit size={14}/> Edit</button>
                      <button onClick={() => handleDelete(item.id, false)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                    </div>
                  </div>
                  
                  {item.children && item.children.length > 0 && (
                    <div className="pl-10 pr-3 pb-3 border-t border-border-main pt-3 bg-gray-50">
                      <Reorder.Group 
                        axis="y" 
                        values={item.children} 
                        onReorder={(newChildren) => handleReorderChildren(item.id, newChildren)}
                        className="space-y-2"
                      >
                        {item.children.map((child) => (
                          <Reorder.Item key={child.id} value={child} className="flex items-center justify-between p-2 border border-border-main bg-white select-none">
                            <div className="flex items-center gap-3">
                              <div className="text-gray-400 cursor-grab active:cursor-grabbing p-1 hover:text-primary transition-colors">
                                <GripVertical size={16} />
                              </div>
                              <div>
                                <span className="font-bold text-text-main text-sm">{child.title}</span>
                                <div className="text-xs text-secondary">/{child.slug}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {child.is_page && (
                                <Link href={`/admin/content/${child.id}`} className="text-secondary hover:underline text-xs flex items-center gap-1 font-bold">
                                  <FileEdit size={12}/> Edit Content
                                </Link>
                              )}
                              <button onClick={() => handleEdit(child, item.id)} className="text-secondary hover:underline text-xs">Edit</button>
                              <button onClick={() => handleDelete(child.id, true, item.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                            </div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>
                  )}
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}

