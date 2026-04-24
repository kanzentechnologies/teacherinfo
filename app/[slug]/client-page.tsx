'use client';

import { useEffect, useState } from 'react';
import { getPages, Page } from '@/lib/pageStore';

export default function CustomPageClient({ slug }: { slug: string }) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIt = async () => {
      const pathname = `/${slug}`;
      const pages = await getPages();
      const found = pages.find((p: Page) => p.slug === pathname || p.slug === slug || `/${p.slug}` === pathname);
      
      if (found && found.status === 'Published') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(found);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    };
    fetchIt();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">404 - Page Not Found</h1>
        <p className="text-text-muted">The page you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border-main p-6 md:p-10">
      <h1 className="text-3xl font-bold text-primary mb-8 border-b border-border-main pb-4">
        {page.title}
      </h1>
      <div 
        className="prose prose-blue max-w-none text-text-main"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
