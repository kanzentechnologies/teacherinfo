import Link from 'next/link';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import { QuickLinkType } from '@/lib/quickLinkStore';

export function QuickLinks({ links }: { links: QuickLinkType[] }) {
  if (!links || links.length === 0) return null;
  const displayLinks = links.slice(0, 12);
  
  return (
    <div className="bg-white border border-border-main">
      <div className="bg-gray-100 border-b border-border-main px-4 py-3 flex justify-between items-center">
        <h3 className="font-bold text-primary flex items-center gap-2">
          <LinkIcon size={18} /> Quick Links
        </h3>
      </div>
      <ul className="divide-y divide-border-main">
        {displayLinks.map((link) => {
          const isInternal = link.link?.startsWith('/') || link.url?.startsWith('/');
          const href = link.link || link.url || '/';
          return (
            <li key={link.id}>
              {isInternal ? (
                <Link 
                  href={href}
                  className="flex items-center justify-between px-4 py-3 hover:bg-hover-bg transition-colors text-sm text-text-main hover:text-primary font-medium"
                >
                  <span className="break-words max-w-[95%] min-w-0 flex-1">{link.title}</span>
                </Link>
              ) : (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 hover:bg-hover-bg transition-colors text-sm text-text-main hover:text-primary font-medium"
                >
                  <span className="break-words max-w-[90%] min-w-0 flex-1">{link.title}</span>
                  <ExternalLink size={14} className="text-text-muted flex-shrink-0 ml-2" />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
