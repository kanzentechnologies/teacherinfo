'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPageBySlug, StaticPage } from '@/lib/pageStore';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export default function StaticPageView() {
  const { slug } = useParams();
  const [page, setPage] = useState<StaticPage | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(getPageBySlug(slug as string));
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
            <p className="text-text-muted">Page not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Navigation />
      
      <main className="flex-grow py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-white border border-border-main p-6 sm:p-10 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 border-b border-border-main pb-4">
            {page.title}
          </h1>
          
          <div 
            className="prose prose-slate max-w-none prose-headings:text-primary prose-a:text-secondary prose-strong:text-primary"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
          
          <div className="mt-12 pt-6 border-t border-border-main text-xs text-text-muted italic">
            Last updated on {page.lastUpdated}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
