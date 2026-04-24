'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, Edit, Trash2, GripVertical } from 'lucide-react';
import { getQuickLinks, saveQuickLinks, QuickLinkType, defaultQuickLinks, deleteQuickLink } from '@/lib/quickLinkStore';
import { Reorder } from 'motion/react';
import * as Icons from 'lucide-react';

const iconList = ['Calculator', 'FileText', 'Monitor', 'ClipboardList', 'BookOpen', 'Briefcase', 'Link', 'ExternalLink', 'Info', 'File', 'Folder', 'User', 'Settings'];
const colorList = ['blue', 'green', 'purple', 'orange', 'teal', 'rose', 'gray'];

export default function QuickLinksManagementPage() {
  const [links, setLinks] = useState<QuickLinkType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [icon, setIcon] = useState('Link');
  const [color, setColor] = useState('blue');

  useEffect(() => {
    const fetchLinks = async () => {
      setLinks(await getQuickLinks());
    };
    fetchLinks();
  }, []);

  const handleSaveLinks = async (newLinks: QuickLinkType[]) => {
    setLinks(newLinks);
    await saveQuickLinks(newLinks);
  };

  const resetForm = () => {
    setTitle('');
    setLinkUrl('');
    setIcon('Link');
    setColor('blue');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !linkUrl) return;

    const newLinkItem: QuickLinkType = {
      id: editingId || Math.floor(Math.random() * 100000000),
      title,
      link: linkUrl,
      icon,
      color,
      order: editingId ? (links.find(l => l.id === editingId)?.order || 0) : links.length + 1,
    };

    let newLinks = [...links];
    if (editingId) {
      newLinks = newLinks.map(l => l.id === editingId ? newLinkItem : l);
    } else {
      newLinks.push(newLinkItem);
    }

    await handleSaveLinks(newLinks);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this specific link?')) return;
    await deleteQuickLink(id);
    const newLinks = links.filter(l => l.id !== id);
    setLinks(newLinks);
  };

  const handleEdit = (linkItem: QuickLinkType) => {
    setTitle(linkItem.title);
    setLinkUrl(linkItem.link);
    setIcon(linkItem.icon);
    setColor(linkItem.color);
    setEditingId(linkItem.id);
    setIsAdding(true);
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Useful / Quick Links</h1>
            <p className="text-sm text-text-muted">Manage the icon button links shown on the homepage</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Add Link
          </button>
        </div>

        {isAdding && (
          <div className="bg-white border border-border-main p-6">
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">
              {editingId ? 'Edit Link' : 'Add New Link'}
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="e.g. Income Tax" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">URL / Link</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="https://... or /category/..." 
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Icon Theme</label>
                <select 
                  className="w-full border border-border-main p-2 text-sm"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                >
                  {iconList.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Color Theme</label>
                <select 
                  className="w-full border border-border-main p-2 text-sm capitalize"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {colorList.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-border-main text-sm font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Link</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-border-main">
          <div className="p-4">
            <Reorder.Group axis="y" values={links} onReorder={handleSaveLinks} className="space-y-2">
              {links.map((linkItem) => (
                <Reorder.Item key={linkItem.id} value={linkItem} className="border border-border-main bg-white select-none">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 cursor-grab active:cursor-grabbing p-1 hover:text-primary transition-colors">
                        <GripVertical size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-text-main">{linkItem.title}</span>
                        <div className="text-xs text-secondary truncate max-w-[300px]">{linkItem.link}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 text-xs bg-gray-100 uppercase">{linkItem.color}</div>
                      <button onClick={() => handleEdit(linkItem)} className="text-secondary hover:underline text-sm flex items-center gap-1"><Edit size={14}/> Edit</button>
                      <button onClick={() => handleDelete(linkItem.id)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {links.length === 0 && (
              <div className="text-center py-10 text-text-muted italic">No quick links added yet.</div>
            )}
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
