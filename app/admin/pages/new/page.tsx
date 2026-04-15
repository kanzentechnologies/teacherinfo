'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { AdminWrapper } from '@/components/admin/AdminWrapper';

export default function CreatePage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, slug, content });
    alert('Page published successfully!');
  };

  return (
    <AdminWrapper>
      <div className="max-w-5xl mx-auto p-6 bg-white border border-border-main">
        <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
          <h1 className="text-2xl font-bold text-primary">Create New Page</h1>
          <Link href="/admin/pages" className="text-sm text-secondary hover:underline">
            Back to Pages
          </Link>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-primary mb-2">
                Page Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
                placeholder="e.g. About Us"
                required
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-bold text-primary mb-2">
                URL Slug
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
                placeholder="e.g. about-us"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">
              Page Content
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
              Publish Page
            </button>
          </div>
        </form>
      </div>
    </AdminWrapper>
  );
}
