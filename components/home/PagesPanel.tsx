import Link from 'next/link';
import { FileText } from 'lucide-react';
import { PageItem } from '@/lib/pageStore';

export function PagesPanel({ pages }: { pages: PageItem[] }) {
  if (!pages || pages.length === 0) return null;
  return (
    <div className="bg-white border border-border-main">
      <div className="bg-gray-100 border-b border-border-main px-4 py-3 flex justify-between items-center">
        <h3 className="font-bold text-primary flex items-center gap-2">
          <FileText size={18} />
          Pages
        </h3>
      </div>
      <ul className="divide-y divide-border-main">
        {pages.map((page, index) => (
          <li key={page.id || index}>
            <Link 
              href={`/${page.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-hover-bg transition-colors text-sm text-text-main hover:text-primary font-medium"
            >
              <span className="break-words min-w-0 flex-1">{page.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
