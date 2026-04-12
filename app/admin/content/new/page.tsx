'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload } from 'lucide-react';

export default function CreateContent() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Content saved successfully! (Mock)');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="text-secondary hover:bg-gray-100 p-2 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-primary">Create New Content</h1>
      </div>

      <div className="bg-white border border-border-main p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-sm font-bold text-text-main mb-2" htmlFor="title">
              Content Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              placeholder="Enter descriptive title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-text-main mb-2" htmlFor="category">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
                required
              >
                <option value="">Select Category</option>
                <option value="study-materials">Study Materials</option>
                <option value="previous-papers">Previous Papers</option>
                <option value="jobs">Job Notifications</option>
                <option value="results">Results</option>
                <option value="downloads">Downloads</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-text-main mb-2" htmlFor="subcategory">
                Subcategory
              </label>
              <select
                id="subcategory"
                className="w-full px-3 py-2 border border-border-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
              >
                <option value="">Select Subcategory</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="gk">General Knowledge</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-text-main mb-2" htmlFor="description">
              Description / Content Body <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-border-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              placeholder="Enter the main content here..."
              required
            ></textarea>
          </div>

          <div className="border border-dashed border-gray-400 bg-gray-50 p-6 text-center">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-text-main mb-1">Upload PDF or Document</p>
            <p className="text-xs text-text-muted mb-4">Max file size: 10MB</p>
            <input type="file" id="file-upload" className="hidden" />
            <label 
              htmlFor="file-upload" 
              className="inline-block bg-white border border-border-main px-4 py-2 text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Browse Files
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="publish"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="publish" className="text-sm font-medium text-text-main">
              Publish immediately
            </label>
          </div>

          <div className="pt-4 border-t border-border-main flex gap-4">
            <button
              type="submit"
              className="bg-primary text-white font-bold py-2 px-6 rounded-sm hover:bg-secondary transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Save Content
            </button>
            <Link
              href="/admin/dashboard"
              className="bg-gray-200 text-text-main font-bold py-2 px-6 rounded-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
