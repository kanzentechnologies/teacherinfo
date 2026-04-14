'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, GripVertical, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getMenu, saveMenu, MenuItem } from '@/lib/menuStore';

export default function NavbarManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'internal' | 'external' | 'dropdown'>('internal');
  const [link, setLink] = useState('');
  const [parentId, setParentId] = useState<string>('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuItems(getMenu());
  }, []);

  const handleSaveMenu = (newMenu: MenuItem[]) => {
    setMenuItems(newMenu);
    saveMenu(newMenu);
    window.dispatchEvent(new Event('menuUpdated'));
  };

  const resetForm = () => {
    setTitle('');
    setType('internal');
    setLink('');
    setParentId('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newItem: MenuItem = {
      id: editingId || Date.now(),
      title,
      link: type === 'dropdown' ? '#' : link,
      type,
      order: 0,
      children: type === 'dropdown' ? [] : undefined,
    };

    let newMenu = [...menuItems];

    if (editingId) {
      // Edit existing
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
      
      // If parent changed, we need to move it
      // For simplicity, let's just delete and re-add if we are editing and parent changed
      // Actually, let's just handle simple edits for now
    } else {
      // Add new
      if (parentId) {
        const parentIndex = newMenu.findIndex(item => item.id.toString() === parentId);
        if (parentIndex !== -1) {
          newItem.order = (newMenu[parentIndex].children?.length || 0) + 1;
          newMenu[parentIndex].children = [...(newMenu[parentIndex].children || []), newItem];
        }
      } else {
        newItem.order = newMenu.length + 1;
        newMenu.push(newItem);
      }
    }

    handleSaveMenu(newMenu);
    resetForm();
  };

  const handleDelete = (id: number, isChild: boolean, parentId?: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    let newMenu = [...menuItems];
    if (isChild && parentId) {
      const parentIndex = newMenu.findIndex(item => item.id === parentId);
      if (parentIndex !== -1 && newMenu[parentIndex].children) {
        newMenu[parentIndex].children = newMenu[parentIndex].children!.filter(child => child.id !== id);
      }
    } else {
      newMenu = newMenu.filter(item => item.id !== id);
    }
    handleSaveMenu(newMenu);
  };

  const handleEdit = (item: MenuItem, parentIdStr?: string) => {
    setTitle(item.title);
    setType(item.type);
    setLink(item.link);
    setParentId(parentIdStr || '');
    setEditingId(item.id);
    setIsAdding(true);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newMenu = [...menuItems];
    if (direction === 'up' && index > 0) {
      const temp = newMenu[index];
      newMenu[index] = newMenu[index - 1];
      newMenu[index - 1] = temp;
    } else if (direction === 'down' && index < newMenu.length - 1) {
      const temp = newMenu[index];
      newMenu[index] = newMenu[index + 1];
      newMenu[index + 1] = temp;
    }
    handleSaveMenu(newMenu);
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Navbar Management</h1>
            <p className="text-sm text-text-muted">Manage main menu and dropdown items</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Add Menu Item
          </button>
        </div>

        {isAdding && (
          <div className="bg-white border border-border-main p-6">
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">
              {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Menu Title</label>
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
                <label className="block text-sm font-bold text-primary mb-1">Link Type</label>
                <select 
                  className="w-full border border-border-main p-2 text-sm bg-white"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="internal">Internal Page / Category</option>
                  <option value="external">External URL</option>
                  <option value="dropdown">Dropdown (Parent)</option>
                </select>
              </div>
              {type !== 'dropdown' && (
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">URL / Path</label>
                  <input 
                    type="text" 
                    className="w-full border border-border-main p-2 text-sm" 
                    placeholder="/about" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Parent Menu (Optional)</label>
                <select 
                  className="w-full border border-border-main p-2 text-sm bg-white"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  disabled={type === 'dropdown'}
                >
                  <option value="">None (Top Level)</option>
                  {menuItems.filter(item => item.type === 'dropdown').map(item => (
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
            <h3 className="font-bold text-primary">Current Menu Structure</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={item.id} className="border border-border-main bg-white">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1 text-gray-400 cursor-pointer">
                        <ChevronUp size={14} className="hover:text-primary" onClick={() => moveItem(index, 'up')} />
                        <ChevronDown size={14} className="hover:text-primary" onClick={() => moveItem(index, 'down')} />
                      </div>
                      <div>
                        <span className="font-bold text-text-main">{item.title}</span>
                        <span className="ml-2 text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-sm border border-gray-200">
                          {item.type}
                        </span>
                        <div className="text-xs text-secondary mt-0.5">{item.link}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(item)} className="text-secondary hover:underline text-sm flex items-center gap-1"><Edit size={14}/> Edit</button>
                      <button onClick={() => handleDelete(item.id, false)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                    </div>
                  </div>
                  
                  {item.children && item.children.length > 0 && (
                    <ul className="pl-10 pr-3 pb-3 space-y-2 border-t border-border-main pt-3 bg-gray-50">
                      {item.children.map((child) => (
                        <li key={child.id} className="flex items-center justify-between p-2 border border-border-main bg-white">
                          <div className="flex items-center gap-3">
                            <GripVertical size={16} className="text-gray-400" />
                            <div>
                              <span className="font-bold text-text-main text-sm">{child.title}</span>
                              <div className="text-xs text-secondary">{child.link}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleEdit(child, item.id.toString())} className="text-secondary hover:underline text-xs">Edit</button>
                            <button onClick={() => handleDelete(child.id, true, item.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
