import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const links = [
  { title: 'Official AP DSC Website', url: '#' },
  { title: 'Ministry of Education', url: '#' },
  { title: 'NCERT Official Portal', url: '#' },
  { title: 'CBSE Academic Website', url: '#' },
  { title: 'UGC Official Website', url: '#' },
];

export function ImportantLinks() {
  return (
    <div className="bg-white border border-border-main">
      <div className="bg-gray-100 border-b border-border-main px-4 py-3">
        <h3 className="font-bold text-primary">Important Links</h3>
      </div>
      <ul className="divide-y divide-border-main">
        {links.map((link, index) => (
          <li key={index}>
            <a 
              href={link.url} 
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
