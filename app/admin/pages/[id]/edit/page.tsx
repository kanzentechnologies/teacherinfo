'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { getPages, savePages, Page } from '@/lib/pageStore';
import { useRouter, useParams } from 'next/navigation';

export default function EditPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const [page, setPage] = useState<Page | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(false);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  useEffect(() => {
    const fetchPage = async () => {
      const pages = await getPages();
      const p = pages.find(p => p.id === params.id);
      if (p) {
        setPage(p);
        setTitle(p.title);
        setSlug(p.slug);
        setContent(p.content);
        setStatus(p.status);
      }
    };
    fetchPage();
  }, [params.id]);

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

  const handlePublish = async (e: React.FormEvent, newStatus?: 'Published' | 'Draft') => {
    e.preventDefault();
    if (!page) return;

    const updatedPage: Page = {
      ...page,
      title,
      slug,
      content,
      status: newStatus || status,
      date: new Date().toISOString().split('T')[0],
    };

    await savePages([updatedPage]);
    alert('Page updated successfully!');
    router.push('/admin/pages');
  };

  if (!page) return <AdminWrapper><div className="p-8">Loading...</div></AdminWrapper>;

  return (
    <AdminWrapper>
      <div className="max-w-5xl mx-auto p-6 bg-white border border-border-main">
        <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
          <h1 className="text-2xl font-bold text-primary">Edit Page</h1>
          <Link href="/admin/pages" className="text-sm text-secondary hover:underline">
            Back to Pages
          </Link>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-primary mb-2">
                Page Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between pointer-events-none mb-2">
                <label htmlFor="slug" className="block text-sm font-bold text-primary">
                  URL Slug
                </label>
                <span className="text-xs text-gray-500 font-normal">
                  {autoSlug ? '(Auto-generated)' : '(Manual edit)'}
                </span>
              </div>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={handleSlugChange}
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
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
              onClick={(e) => handlePublish(e, 'Draft')}
              className="px-6 py-2 border border-border-main text-text-main hover:bg-gray-50 text-sm font-bold transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={(e) => handlePublish(e, 'Published')}
              className="px-6 py-2 bg-primary text-white hover:bg-secondary text-sm font-bold transition-colors"
            >
              Publish Updates
            </button>
          </div>
        </form>
      </div>
    </AdminWrapper>
  );
}
