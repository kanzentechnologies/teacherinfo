'use client';

import React, { useState } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const mockAnnouncements = [
  { id: 1, title: 'AP DSC 2024 Notification Released', date: '2024-04-12', priority: 'High', status: 'Active' },
  { id: 2, title: 'TET 2024 Results Declared', date: '2024-04-10', priority: 'High', status: 'Active' },
  { id: 3, title: 'New Study Materials for Mathematics Uploaded', date: '2024-04-08', priority: 'Normal', status: 'Active' },
  { id: 4, title: 'SSC CGL 2024 Exam Dates Announced', date: '2024-04-05', priority: 'Normal', status: 'Inactive' },
];

export default function AnnouncementsManagementPage() {
  const [isAdding, setIsAdding] = useState(false);

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
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">Add New Announcement</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-primary mb-1">Announcement Title</label>
                <input type="text" className="w-full border border-border-main p-2 text-sm" placeholder="Enter announcement text" />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Priority</label>
                <select className="w-full border border-border-main p-2 text-sm bg-white">
                  <option value="normal">Normal</option>
                  <option value="high">High (Shows &apos;NEW&apos; badge)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Link (Optional)</label>
                <input type="text" className="w-full border border-border-main p-2 text-sm" placeholder="URL to link to" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border border-border-main text-sm font-bold">Cancel</button>
                <button type="button" className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Announcement</button>
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
                {mockAnnouncements.map((item) => (
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
