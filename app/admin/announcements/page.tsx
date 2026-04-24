'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Announcement, getAnnouncements, saveAnnouncement, deleteAnnouncement } from '@/lib/announcementStore';

export default function AnnouncementsManagementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'High' | 'Normal'>('Normal');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [link, setLink] = useState('');

  const loadAnnouncements = async () => {
    const data = await getAnnouncements();
    setAnnouncements(data);
  };

  useEffect(() => {
    let active = true;
    const fetchIt = async () => {
      const data = await getAnnouncements();
      if (active) {
        setAnnouncements(data);
      }
    };
    fetchIt();
    return () => { active = false; };
  }, []);

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setTitle(announcement.title);
    setPriority(announcement.priority);
    setStatus(announcement.status);
    setLink(announcement.link || '');
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement(id);
      loadAnnouncements();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    const payload: Partial<Announcement> = {
      title,
      priority,
      status,
      link,
      date: new Date().toISOString().split('T')[0]
    };

    if (editingId) {
      payload.id = editingId;
    } else {
      payload.id = Math.floor(Math.random() * 100000000);
    }

    await saveAnnouncement(payload);
    
    setIsAdding(false);
    setEditingId(null);
    setTitle('');
    setPriority('Normal');
    setStatus('Active');
    setLink('');
    loadAnnouncements();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setTitle('');
    setPriority('Normal');
    setStatus('Active');
    setLink('');
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Manage Announcements</h1>
            <p className="text-sm text-text-muted">Manage scrolling ticker and alerts</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Add Announcement
          </button>
        </div>

        {isAdding && (
          <div className="bg-white border border-border-main p-6">
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">{editingId ? 'Edit Announcement' : 'Add New Announcement'}</h2>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-primary mb-1">Announcement Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="Enter announcement text" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Priority</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'High' | 'Normal')}
                  className="w-full border border-border-main p-2 text-sm bg-white"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High (Shows &apos;NEW&apos; badge)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full border border-border-main p-2 text-sm bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-primary mb-1">Link (Optional)</label>
                <input 
                  type="text" 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="URL to link to" 
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={handleCancel} className="px-4 py-2 border border-border-main text-sm font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Announcement</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-border-main">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-border-main text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-hover-bg">
                    <td className="px-4 py-3 font-medium text-text-main">{item.title}</td>
                    <td className="px-4 py-3 text-text-muted">{item.date}</td>
                    <td className="px-4 py-3">
                      {item.priority === 'High' ? (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-sm border border-red-200 font-bold">HIGH</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-sm border border-gray-200">NORMAL</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.status === 'Active' ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-sm border border-green-200">Active</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-sm border border-gray-200">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(item)} className="text-secondary hover:underline mr-3 inline-flex items-center gap-1"><Edit size={14}/> Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline inline-flex items-center gap-1"><Trash2 size={14}/> Delete</button>
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
