import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/lib/categoryStore';
import { Page } from '@/lib/pageStore';
import { Post } from '@/lib/postStore';

export function ContentSections({ categories, posts, pages }: { categories: Category[], posts?: Post[], pages: Page[] }) {
  if (!categories || categories.length === 0) return null;
  
  // Display only first 4 categories on homepage
  const displayCats = categories.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {displayCats.map((section, catIndex) => {
        // Filter posts by category slug, take first 5
        let sectionItems = (posts || []).filter(p => p.categorySlug === section.slug).slice(0, 5);
        
        // If there are no posts for this category, we optionally fallback to pages, but it's better to show empty or just whatever we have
        // But the user specifically wanted useful links to show the first 5 records
        
        return (
          <div key={section.id} className="bg-white border border-border-main">
            <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-bold">{section.name}</h3>
              <Link href={`/category/${section.slug}`} className="text-xs hover:underline flex items-center">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <ul className="divide-y divide-border-main">
              {sectionItems.length > 0 ? (
                sectionItems.map((item, index) => (
                  <li key={index}>
                    {item.type === 'Link' ? (
                      <a href={item.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 hover:bg-hover-bg transition-colors group">
                        <div className="text-sm font-medium text-text-main group-hover:text-primary mb-1">
                          {item.title}
                        </div>
                        <div className="text-xs text-text-muted">
                          {item.date} <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-[10px] px-1 rounded-sm border border-blue-200">External Link</span>
                        </div>
                      </a>
                    ) : (
                      <Link href={`/content/${item.id}`} className="block px-4 py-3 hover:bg-hover-bg transition-colors group">
                        <div className="text-sm font-medium text-text-main group-hover:text-primary mb-1">
                          {item.title}
                        </div>
                        <div className="text-xs text-text-muted">
                          {item.date} {item.type === 'PDF' && <span className="ml-2 inline-block bg-red-100 text-red-800 text-[10px] px-1 rounded-sm border border-red-200">PDF</span>}
                        </div>
                      </Link>
                    )}
                  </li>
                ))
              ) : (
                <li>
                  <div className="px-4 py-6 text-sm text-center text-text-muted italic">
                    No content available yet.
                  </div>
                </li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
