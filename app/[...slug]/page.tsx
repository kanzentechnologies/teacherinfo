import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Share2 } from 'lucide-react';
import { getPageBySlug, getPages } from '@/lib/pageStore';
import Link from 'next/link';
import { PrintButton } from '@/components/ui/PrintButton';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map((page) => ({
    slug: page.slug.split('/'),
  }));
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

  let parsedLinks: any[] = [];
  if (item.layout === 'links') {
    try {
      parsedLinks = JSON.parse(item.content || '[]');
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
              parsedLinks.map((link) => (
                <div key={link.id} className="border border-border-main p-4 hover:shadow-md transition-shadow group flex items-start gap-4 bg-gray-50 hover:bg-blue-50/30">
                  <div className="bg-primary/10 text-primary p-2 mt-1 rounded">
                    <Share2 size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-primary text-lg group-hover:text-secondary group-hover:underline">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.title}
                      </a>
                    </h3>
                    {link.description && (
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">{link.description}</p>
                    )}
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-secondary mt-3 inline-block uppercase tracking-wide">
                      Visit Link →
                    </a>
                  </div>
                </div>
              ))
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
