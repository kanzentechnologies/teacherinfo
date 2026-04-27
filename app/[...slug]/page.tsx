import { getNavItemBySlug, NavItem, getNavItems } from '@/lib/navStore';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link as LinkIcon, Share2, Printer, Calendar } from 'lucide-react';
import Link from 'next/link';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const items = await getNavItems();
    if (!items || items.length === 0) {
      console.warn('No items found for slug generation in [...slug]');
      return [];
    }
    
    // Create a map to build full paths
    const map = new Map<string, any>();
    items.forEach(item => map.set(item.id, item));
    
    const params: { slug: string[] }[] = [];
    
    // Add a fallback dummy param to ensure generateStaticParams returns at least one item during build
    // if the fetch failed or database is empty.
    if (items.length === 0) {
      params.push({ slug: ['fallback-page'] });
    }

    for (const item of items) {
      if (item.status === 'Published' && item.slug) {
        const pathSlugs = [];
        let current = item;
        let visited = new Set();
        while (current && !visited.has(current.id)) {
          visited.add(current.id);
          pathSlugs.unshift(current.slug);
          if (current.parent_id && map.has(current.parent_id)) {
            current = map.get(current.parent_id);
          } else {
            break;
          }
        }
        params.push({ slug: pathSlugs });
      }
    }
    return params;
  } catch (e) {
    console.error('Error generating static params in [...slug]:', e);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const item = await getNavItemBySlug(slugPath);

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

export default async function NavItemPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const item = await getNavItemBySlug(slugPath);

  if (!item || item.status !== 'Published') {
    notFound();
  }

  if (item.externalUrl && !item.is_page) {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 text-center py-20">
          <h1 className="text-2xl font-bold text-primary mb-4">{item.title}</h1>
          <p className="mb-4">This page links to an external resource.</p>
          <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="bg-secondary text-white px-4 py-2 font-bold hover:bg-primary transition-colors inline-block">
            Visit Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">{item.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted border-b border-border-main pb-4 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Published: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}</span>
            </div>
          </div>
          
          {item.is_page && item.content ? (
            <div 
              className="prose max-w-none mt-6 text-text-main text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.content }} 
            />
          ) : (
            <div className="mt-6 text-text-muted">
              {item.children && item.children.length > 0 ? (
                <ul className="divide-y divide-border-main border border-border-main">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <Link href={child.is_page ? `/${slugPath}/${child.slug}` : (child.externalUrl || '#')} 
                            target={!child.is_page ? '_blank' : '_self'}
                            className="block px-4 py-3 hover:bg-hover-bg transition-colors">
                        <span className="font-bold text-primary">{child.title}</span>
                        {!child.is_page && <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-1 rounded">External Link</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                 <p className="py-10 text-center italic">This page has no content yet.</p>
              )}
            </div>
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
            <a href={`javascript:window.print()`} className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1.5 rounded text-text-main hover:bg-gray-200 transition-colors">
              <Printer size={16} /> Print
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
