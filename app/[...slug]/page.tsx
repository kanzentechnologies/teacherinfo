import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Share2, ExternalLink } from 'lucide-react';
import { getPageBySlug, getPages } from '@/lib/pageStore';
import Link from 'next/link';
import { PrintButton } from '@/components/ui/PrintButton';
import { LinksTableViewer } from '@/components/public/LinksTableViewer';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const item = await getPageBySlug(slugPath);

  if (item && item.status === 'Published') {
    return {
      title: item.title,
      description: '', // Intentionally blank so only the title shows when sharing
      openGraph: {
        title: `${item.title} | Teacher Info Portal`,
        description: '',
        url: `/${slugPath}`,
        siteName: 'Teacher Info Portal',
        type: 'website',
        images: [
          {
            url: 'https://pub-394d485f92444007bc7c08718b11be20.r2.dev/logo.png',
            width: 1200,
            height: 630,
            alt: item.title,
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${item.title} | Teacher Info Portal`,
        description: '',
        images: ['https://pub-394d485f92444007bc7c08718b11be20.r2.dev/logo.png'],
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

  let parsedLinks: any[] = [];
  if (item.layout === 'links') {
    try {
      parsedLinks = JSON.parse(item.content || '[]');
      parsedLinks.sort((a, b) => {
        const titleA = a.title || '';
        const titleB = b.title || '';
        return titleA.localeCompare(titleB, undefined, { numeric: true, sensitivity: 'base' });
      });
    } catch {
      parsedLinks = [];
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-main p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-border-main pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight break-words">{item.title}</h1>
        </div>
        
        {item.layout === 'links' ? (
          <div className="mt-6 flex flex-col gap-4">
            {parsedLinks.length === 0 ? (
              <p className="text-text-muted">No links available on this page.</p>
            ) : (
              <LinksTableViewer links={parsedLinks} />
            )}
          </div>
        ) : (
          <div 
            className="prose max-w-none mt-6 text-text-main text-sm md:text-base leading-relaxed break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: item.content || '<p>No content provided for this page.</p>' }} 
          />
        )}

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
  );
}
