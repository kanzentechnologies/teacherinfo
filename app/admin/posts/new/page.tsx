'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { AdminWrapper } from '@/components/admin/AdminWrapper';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      title,
      category,
      content
    });
    alert('Post published successfully! (Check console for data)');
  };

  return (
    <AdminWrapper>
      <div className="max-w-5xl mx-auto p-6 bg-white border border-border-main">
        <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
          <h1 className="text-2xl font-bold text-primary">Create New Post</h1>
          <Link href="/admin/posts" className="text-sm text-secondary hover:underline">
            Back to Posts
          </Link>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-bold text-primary mb-2">
                Post Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
                placeholder="Enter post title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-primary mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary bg-white"
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="useful-links">Useful Links</option>
                <option value="income-tax">Income Tax</option>
                <option value="gos-and-proceedings">GO’s & Proceedings</option>
                <option value="softwares">Softwares</option>
                <option value="forms">Forms</option>
                <option value="academics">Academics</option>
                <option value="services">Services</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">
              Content
            </label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div className="pt-4 border-t border-border-main flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-2 border border-border-main text-text-main hover:bg-gray-50 text-sm font-bold transition-colors"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white hover:bg-secondary text-sm font-bold transition-colors"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </AdminWrapper>
  );
}
