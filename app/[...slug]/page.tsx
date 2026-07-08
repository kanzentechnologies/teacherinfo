import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Share2, ExternalLink } from 'lucide-react';
import { getPageBySlug, getPages } from '@/lib/pageStore';
import Link from 'next/link';
import { PrintButton } from '@/components/ui/PrintButton';

const renderLinksTable = (links: any[], level: number = 0) => {
  const normalLinks = links.filter((l: any) => l.type !== 'folder');
  const folders = links.filter((l: any) => l.type === 'folder');

  return (
    <div className={`flex flex-col gap-4 ${level > 0 ? 'ml-2 sm:ml-4' : ''}`}>
      {normalLinks.length > 0 && (
        <div className="overflow-x-auto shadow-sm">
          <table className="w-full border-collapse border border-border-main text-left bg-white">
            <thead>
              <tr className="bg-gray-100 text-primary border-b border-border-main">
                <th className="p-3 border-r border-border-main w-12 text-center text-sm uppercase tracking-wide">#</th>
                <th className="p-3 border-r border-border-main text-sm uppercase tracking-wide">Title & Description</th>
              </tr>
            </thead>
            <tbody>
              {normalLinks.map((link: any, idx: number) => (
                <tr key={link.id} className="border-b border-border-main hover:bg-blue-50/50 transition-colors group">
                  <td className="p-3 border-r border-border-main text-center font-bold text-gray-500">{idx + 1}</td>
                  <td className="p-3 border-r border-border-main">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-lg hover:text-secondary hover:underline break-words group-hover:text-secondary inline-flex items-center gap-2">
                      {link.title} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    {link.description && (
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">{link.description}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {folders.map((folder: any) => (
        <details key={folder.id} className="border border-border-main rounded bg-gray-50 group" open>
          <summary className="p-3 font-bold text-lg cursor-pointer hover:bg-gray-100 list-none flex items-center gap-2 text-primary">
            <span className="transform group-open:rotate-90 transition-transform text-gray-400 text-sm">▶</span>
            <span className="text-xl">📁</span> {folder.title}
          </summary>
          <div className="p-3 sm:p-4 border-t border-border-main bg-white">
            {folder.children && folder.children.length > 0 ? (
              renderLinksTable(folder.children, level + 1)
            ) : (
              <p className="text-sm text-text-muted italic">Empty folder</p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
};

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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
        description: item.content ? item.content.substring(0, 150).replace(/<[^>]*>?/gm, '') : `${item.title} at Teacher Info Portal`,
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
        return titleA.localeCompare(titleB);
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
              renderLinksTable(parsedLinks)
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
