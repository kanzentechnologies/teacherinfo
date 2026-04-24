'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { getPosts, deletePost, Post } from '@/lib/postStore';
import { getCategories, Category } from '@/lib/categoryStore';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedPosts, fetchedCats] = await Promise.all([getPosts(), getCategories()]);
      setPosts(fetchedPosts);
      setCategories(fetchedCats);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const getCategoryName = (slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? cat.name : slug;
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Manage Posts</h1>
            <p className="text-sm text-text-muted">View, edit, and delete posts / category items</p>
          </div>
          <Link 
            href="/admin/posts/new" 
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Create New Post
          </Link>
        </div>

        <div className="bg-white border border-border-main">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-border-main text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-hover-bg">
                    <td className="px-4 py-3 font-medium text-text-main">{post.title}</td>
                    <td className="px-4 py-3 text-text-muted">{getCategoryName(post.categorySlug)}</td>
                    <td className="px-4 py-3 text-text-muted">{post.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-sm border ${
                        post.status === 'Published' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/posts/new?edit=${post.id}`} className="text-secondary hover:underline mr-3">Edit</Link>
                      <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-text-muted italic">No posts found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
