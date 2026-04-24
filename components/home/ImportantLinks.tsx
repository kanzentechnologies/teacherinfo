import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { ImportantLink } from '@/lib/importantLinkStore';

export function ImportantLinks({ links }: { links: ImportantLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="bg-white border border-border-main">
      <div className="bg-gray-100 border-b border-border-main px-4 py-3">
        <h3 className="font-bold text-primary">Important Links</h3>
      </div>
      <ul className="divide-y divide-border-main">
        {links.slice(0, 8).map((link) => (
          <li key={link.id}>
            <a 
              href={link.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 hover:bg-hover-bg transition-colors text-sm text-text-main hover:text-primary"
            >
              <span>{link.title}</span>
              <ExternalLink size={14} className="text-text-muted" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
