'use client';

import React, { useState } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, GripVertical, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

// Mock data for navbar
const initialMenu = [
  { id: 1, title: 'Home', link: '/', type: 'internal', order: 1, children: [] },
  { id: 2, title: 'Useful Links', link: '/category/useful-links', type: 'internal', order: 2, children: [] },
  { id: 3, title: 'Income Tax', link: '/category/income-tax', type: 'internal', order: 3, children: [] },
  { 
    id: 4, 
    title: 'Resources', 
    link: '#', 
    type: 'dropdown', 
    order: 4, 
    children: [
      { id: 41, title: 'GO’s & Proceedings', link: '/category/gos-and-proceedings', type: 'internal', order: 1 },
      { id: 42, title: 'Softwares', link: '/category/softwares', type: 'internal', order: 2 },
      { id: 43, title: 'Forms', link: '/category/forms', type: 'internal', order: 3 },
    ] 
  },
  { id: 5, title: 'Contact Us', link: '/contact', type: 'internal', order: 5, children: [] },
];

export default function NavbarManagementPage() {
  const [menuItems, setMenuItems] = useState(initialMenu);
  const [isAdding, setIsAdding] = useState(false);

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
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">Add New Menu Item</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Menu Title</label>
                <input type="text" className="w-full border border-border-main p-2 text-sm" placeholder="e.g. About Us" />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Link Type</label>
                <select className="w-full border border-border-main p-2 text-sm bg-white">
                  <option value="internal">Internal Page / Category</option>
                  <option value="external">External URL</option>
                  <option value="dropdown">Dropdown (Parent)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">URL / Path</label>
                <input type="text" className="w-full border border-border-main p-2 text-sm" placeholder="/about" />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Parent Menu (Optional)</label>
                <select className="w-full border border-border-main p-2 text-sm bg-white">
                  <option value="">None (Top Level)</option>
                  <option value="4">Resources</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border border-border-main text-sm font-bold">Cancel</button>
                <button type="button" className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Item</button>
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
                      <div className="flex flex-col gap-1 text-gray-400 cursor-move">
                        <ChevronUp size={14} className="hover:text-primary" />
                        <ChevronDown size={14} className="hover:text-primary" />
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
                      <button className="text-secondary hover:underline text-sm flex items-center gap-1"><Edit size={14}/> Edit</button>
                      <button className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                    </div>
                  </div>
                  
                  {item.children && item.children.length > 0 && (
                    <ul className="pl-10 pr-3 pb-3 space-y-2 border-t border-border-main pt-3 bg-gray-50">
                      {item.children.map((child) => (
                        <li key={child.id} className="flex items-center justify-between p-2 border border-border-main bg-white">
                          <div className="flex items-center gap-3">
                            <GripVertical size={16} className="text-gray-400 cursor-move" />
                            <div>
                              <span className="font-bold text-text-main text-sm">{child.title}</span>
                              <div className="text-xs text-secondary">{child.link}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="text-secondary hover:underline text-xs">Edit</button>
                            <button className="text-red-600 hover:underline text-xs">Delete</button>
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
