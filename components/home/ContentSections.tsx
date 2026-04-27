import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NavItem } from '@/lib/navStore';

export function ContentSections({ navItems }: { navItems: NavItem[] }) {
  if (!navItems || navItems.length === 0) return null;
  
  // Display only first 4 items that have children
  const displayCats = navItems.filter(item => item.children && item.children.length > 0).slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {displayCats.map((section) => {
        let sectionItems = section.children?.slice(0, 5) || [];
        
        return (
          <div key={section.id} className="bg-white border border-border-main">
            <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-bold">{section.title}</h3>
              <Link href={`/${section.slug}`} className="text-xs hover:underline flex items-center">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <ul className="divide-y divide-border-main">
              {sectionItems.length > 0 ? (
                sectionItems.map((item, index) => (
                  <li key={index}>
                    {!item.is_page && item.externalUrl ? (
                      <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 hover:bg-hover-bg transition-colors group">
                        <div className="text-sm font-medium text-text-main group-hover:text-primary mb-1">
                          {item.title}
                        </div>
                        <div className="text-xs text-text-muted">
                          <span className="inline-block bg-blue-100 text-blue-800 text-[10px] px-1 rounded-sm border border-blue-200">External Link</span>
                        </div>
                      </a>
                    ) : (
                      <Link href={`/${section.slug}/${item.slug}`} className="block px-4 py-3 hover:bg-hover-bg transition-colors group">
                        <div className="text-sm font-medium text-text-main group-hover:text-primary mb-1">
                          {item.title}
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
