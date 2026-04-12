'use client';

import React, { useState } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { Upload, FileText, Trash2, Copy, Image as ImageIcon } from 'lucide-react';

const mockFiles = [
  { id: 1, name: 'AP_DSC_Notification_2024.pdf', type: 'PDF', size: '2.4 MB', date: '2024-04-12', url: '/files/1' },
  { id: 2, name: 'Math_Class10_Notes.pdf', type: 'PDF', size: '5.1 MB', date: '2024-04-10', url: '/files/2' },
  { id: 3, name: 'banner_image_spring.jpg', type: 'Image', size: '850 KB', date: '2024-04-08', url: '/files/3' },
  { id: 4, name: 'TET_Syllabus_2024.pdf', type: 'PDF', size: '1.2 MB', date: '2024-04-05', url: '/files/4' },
];

export default function FilesManagementPage() {
  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">File Management</h1>
            <p className="text-sm text-text-muted">Upload and manage documents and images</p>
          </div>
          <button 
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <Upload size={18} />
            Upload File
          </button>
        </div>

        <div className="bg-white border border-border-main p-6">
          <div className="border-2 border-dashed border-border-main p-10 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="font-bold text-primary">Click to upload or drag and drop</p>
            <p className="text-sm text-text-muted mt-1">PDF, DOCX, JPG, PNG (Max 10MB)</p>
          </div>
        </div>

        <div className="bg-white border border-border-main">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-border-main text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">File Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Upload Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {mockFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-hover-bg">
                    <td className="px-4 py-3 font-medium text-text-main flex items-center gap-2">
                      {file.type === 'Image' ? <ImageIcon size={16} className="text-blue-500" /> : <FileText size={16} className="text-red-500" />}
                      {file.name}
                    </td>
                    <td className="px-4 py-3 text-text-muted">{file.type}</td>
                    <td className="px-4 py-3 text-text-muted">{file.size}</td>
                    <td className="px-4 py-3 text-text-muted">{file.date}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-secondary hover:underline mr-3 inline-flex items-center gap-1" title="Copy URL">
                        <Copy size={14}/> Copy URL
                      </button>
                      <button className="text-red-600 hover:underline inline-flex items-center gap-1">
                        <Trash2 size={14}/> Delete
                      </button>
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
