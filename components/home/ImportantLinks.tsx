import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { ImportantLink } from '@/lib/importantLinkStore';

export function ImportantLinks({ links }: { links: ImportantLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="bg-white border border-border-main">
      <div className="bg-gray-100 border-b border-border-main px-4 py-3 flex justify-between items-center">
        <h3 className="font-bold text-primary">Useful Links</h3>
      </div>
      <ul className="divide-y divide-border-main">
        {links.slice(0, 5).map((link) => {
          const isInternal = link.link.startsWith('/');
          return (
            <li key={link.id}>
              {isInternal ? (
                <Link 
                  href={link.link}
                  className="flex items-center justify-between px-4 py-3 hover:bg-hover-bg transition-colors text-sm text-text-main hover:text-primary font-medium"
                >
                  <span>{link.title}</span>
                </Link>
              ) : (
                <a 
                  href={link.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 hover:bg-hover-bg transition-colors text-sm text-text-main hover:text-primary"
                >
                  <span>{link.title}</span>
                  <ExternalLink size={14} className="text-text-muted" />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
