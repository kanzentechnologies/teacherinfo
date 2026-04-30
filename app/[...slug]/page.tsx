import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Share2, Calendar } from 'lucide-react';
import { getPages, getPageBySlug } from '@/lib/pageStore';
import Link from 'next/link';
import { PrintButton } from '@/components/ui/PrintButton';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const pages = await getPages();
    if (!pages || pages.length === 0) {
      console.warn('No items found for slug generation in [...slug]');
      return [{ slug: ['_fallback'] }];
    }
    
    const params: { slug: string[] }[] = [];
    
    for (const page of pages) {
      if (page.status === 'Published' && page.slug) {
        // Our new slugs might contain slashes if users entered them, e.g. "about/us".
        // Split by '/' to form the slug array Next.js expects.
        params.push({ slug: page.slug.split('/').filter(Boolean) });
      }
    }
    
    if (params.length === 0) {
      params.push({ slug: ['_fallback'] });
    }
    return params;
  } catch (e) {
    console.error('Error generating static params in [...slug]:', e);
    return [{ slug: ['_fallback'] }];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const item = await getPageBySlug(slugPath);

  if (item && item.status === 'Published') {
    return {
      title: item.title,
      description: item.content ? item.content.substring(0, 150).replace(/<[^>]*>?/gm, '') : `${item.title} at Teacher Info Portal`,
      openGraph: {
        title: `${item.title} | Teacher Info Portal`,
        description: item.content ? item.content.substring(0, 150).replace(/<[^>]*>?/gm, '') : `${item.title} at Teacher Info Portal`,
        url: `/${slugPath}`,
      },
    };
  }

  return {
    title: 'Page Not Found',
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const item = await getPageBySlug(slugPath);

  if (!item || item.status !== 'Published') {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight break-words">{item.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted border-b border-border-main pb-4 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Published: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}</span>
            </div>
          </div>
          
          <div 
            className="prose max-w-none mt-6 text-text-main text-sm md:text-base leading-relaxed break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: item.content || '<p>No content provided for this page.</p>' }} 
          />

          <div className="mt-8 pt-4 border-t border-border-main flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-bold text-text-muted mr-2 flex items-center gap-1"><Share2 size={16} /> Share:</span>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(item.title)} - https://www.teacherinfo.net/${slugPath}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                WhatsApp
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.teacherinfo.net/${slugPath}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#1877F2] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                Facebook
              </a>
              <a href={`https://twitter.com/intent/tweet?url=https://www.teacherinfo.net/${slugPath}&text=${encodeURIComponent(item.title)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#1DA1F2] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                Twitter
              </a>
              <a href={`https://t.me/share/url?url=https://www.teacherinfo.net/${slugPath}&text=${encodeURIComponent(item.title)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#0088cc] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                Telegram
              </a>
            </div>
            <PrintButton />
          </div>
        </div>
      </div>
    </div>
  );
}
