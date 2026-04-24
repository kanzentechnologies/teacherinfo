'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { AdminWrapper } from '@/components/admin/AdminWrapper';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [category, setCategory] = useState('');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (autoSlug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setAutoSlug(false);
  };
  const [content, setContent] = useState('');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      title,
      slug,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-primary mb-2">
                Post Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="slug" className="block text-sm font-bold text-primary">
                  URL Slug
                </label>
                <span className="text-xs text-gray-500">
                  {autoSlug ? '(Auto-generated)' : '(Manual edit)'}
                </span>
              </div>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={handleSlugChange}
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary bg-gray-50 focus:bg-white"
                placeholder="e.g. post-title"
                required
              />
            </div>
            
            <div className="md:col-span-2">
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
