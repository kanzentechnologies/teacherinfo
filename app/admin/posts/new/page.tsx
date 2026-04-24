'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { getCategories, Category } from '@/lib/categoryStore';
import { getPosts, savePosts, Post } from '@/lib/postStore';

function PostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const defaultCategory = searchParams.get('category');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [categorySlug, setCategorySlug] = useState(defaultCategory || '');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [type, setType] = useState<'Article' | 'PDF' | 'Link'>('Article');
  const [externalUrl, setExternalUrl] = useState('');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const [originalDate, setOriginalDate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedCats, fetchedPosts] = await Promise.all([getCategories(), getPosts()]);
      setCategories(fetchedCats);
      setPosts(fetchedPosts);

      if (editId) {
        const postToEdit = fetchedPosts.find(p => p.id === editId);
        if (postToEdit) {
          setTitle(postToEdit.title);
          setSlug(postToEdit.slug);
          setAutoSlug(false);
          setCategorySlug(postToEdit.categorySlug);
          setContent(postToEdit.content);
          setStatus(postToEdit.status);
          setType(postToEdit.type || 'Article');
          setOriginalDate(postToEdit.date);
          setExternalUrl(postToEdit.externalUrl || '');
        }
      }
    };
    fetchData();
  }, [editId]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (autoSlug && !editId) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setAutoSlug(false);
  };

  const handleSave = async (e: React.FormEvent, submitStatus: 'Published' | 'Draft') => {
    e.preventDefault();
    if (!title || !slug || !categorySlug) return;
    if (type === 'Link' && !externalUrl) {
      alert("External URL is required for Link type.");
      return;
    }

    const newPost: Post = {
      id: editId || crypto.randomUUID(),
      title,
      slug,
      categorySlug,
      content,
      status: submitStatus,
      type,
      externalUrl: type === 'Link' ? externalUrl : undefined,
      date: originalDate || new Date().toISOString().split('T')[0],
    };

    let updatedPosts;
    if (editId) {
      updatedPosts = posts.map(p => p.id === editId ? newPost : p);
    } else {
      updatedPosts = [newPost, ...posts];
    }

    await savePosts(updatedPosts);
    if (defaultCategory === 'useful-links') {
      router.push('/admin/quick-links');
    } else if (defaultCategory) {
      router.push(`/admin/posts?category=${defaultCategory}`);
    } else {
      router.push('/admin/posts');
    }
  };

  const getBackLink = () => {
    if (defaultCategory === 'useful-links') return '/admin/quick-links';
    if (defaultCategory) return `/admin/posts?category=${defaultCategory}`;
    return '/admin/posts';
  };

  const getBackText = () => {
    if (defaultCategory === 'useful-links') return 'Back to Useful Links';
    if (defaultCategory) return `Back to ${defaultCategory.replace(/-/g, ' ')}`;
    return 'Back to Posts';
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white border border-border-main">
      <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
        <h1 className="text-2xl font-bold text-primary">{editId ? 'Edit Post' : 'Create New Post'}</h1>
        <Link href={getBackLink()} className="text-sm text-secondary hover:underline capitalize">
          {getBackText()}
        </Link>
      </div>

      <form className="space-y-6">
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
          
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-primary mb-2">
              Category
            </label>
            <select
              id="category"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary bg-white"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-bold text-primary mb-2">
              Post Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'Article' | 'PDF' | 'Link')}
              className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary bg-white"
            >
              <option value="Article">Article</option>
              <option value="PDF">PDF Download</option>
              <option value="Link">External Link</option>
            </select>
          </div>
          
          {type === 'Link' && (
            <div className="md:col-span-2">
              <label htmlFor="externalUrl" className="block text-sm font-bold text-primary mb-2">
                External Link URL
              </label>
              <input
                type="url"
                id="externalUrl"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
                placeholder="https://example.com"
                required={type === 'Link'}
              />
            </div>
          )}
        </div>

        {type !== 'Link' && (
          <div>
            <label className="block text-sm font-bold text-primary mb-2">
              Content
            </label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        )}

        <div className="pt-4 border-t border-border-main flex justify-end gap-4">
          <button
            type="button"
            onClick={(e) => handleSave(e, 'Draft')}
            className="px-6 py-2 border border-border-main text-text-main hover:bg-gray-50 text-sm font-bold transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSave(e, 'Published')}
            className="px-6 py-2 bg-primary text-white hover:bg-secondary text-sm font-bold transition-colors"
          >
            {editId ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreatePostPage() {
  return (
    <AdminWrapper>
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <PostForm />
      </Suspense>
    </AdminWrapper>
  );
}
