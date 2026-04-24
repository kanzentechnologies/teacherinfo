import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/lib/categoryStore';
import { Page } from '@/lib/pageStore';

export function ContentSections({ categories, pages }: { categories: Category[], pages: Page[] }) {
  if (!categories || categories.length === 0) return null;
  
  // For demo driven by db, showing a few specific categories with latest pages
  // Note: we don't have a category_id on pages currently, so we'll show generic recent pages in each section
  const displayCats = categories.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {displayCats.map((section, catIndex) => {
        // Just slice out a chunk of pages to simulate pages belonging to sections
        const sectionPages = pages.slice(catIndex * 3, (catIndex + 1) * 3);
        if (sectionPages.length === 0) return null;
        
        return (
          <div key={section.id} className="bg-white border border-border-main">
            <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-bold">{section.name}</h3>
              <Link href={`/category/${section.slug}`} className="text-xs hover:underline flex items-center">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <ul className="divide-y divide-border-main">
              {sectionPages.map((item, index) => (
                <li key={index}>
                  <Link href={`/${item.slug}`} className="block px-4 py-3 hover:bg-hover-bg transition-colors group">
                    <div className="text-sm font-medium text-text-main group-hover:text-primary mb-1">
                      {item.title}
                    </div>
                    <div className="text-xs text-text-muted">
                      {item.date}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
