import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const sections = [
  {
    title: 'GO’s & Proceedings',
    items: [
      { title: 'Latest GO on Teacher Transfers 2024', date: '12 Apr 2024', id: '1' },
      { title: 'Proceedings for Summer Vacation', date: '10 Apr 2024', id: '2' },
      { title: 'Guidelines for New Academic Year', date: '08 Apr 2024', id: '3' },
      { title: 'Revised Pay Scale Proceedings', date: '05 Apr 2024', id: '4' },
    ],
    link: '/category/gos-and-proceedings'
  },
  {
    title: 'Academics',
    items: [
      { title: 'Class 10 Mathematics Syllabus 2024-25', date: '11 Apr 2024', id: '5' },
      { title: 'Science Lesson Plans for High School', date: '09 Apr 2024', id: '6' },
      { title: 'English Grammar Worksheets', date: '07 Apr 2024', id: '7' },
      { title: 'Academic Calendar 2024-25', date: '04 Apr 2024', id: '8' },
    ],
    link: '/category/academics'
  }
];

export function ContentSections() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sections.map((section) => (
        <div key={section.title} className="bg-white border border-border-main">
          <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold">{section.title}</h3>
            <Link href={section.link} className="text-xs hover:underline flex items-center">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <ul className="divide-y divide-border-main">
            {section.items.map((item, index) => (
              <li key={index}>
                <Link href={`/content/${item.id}`} className="block px-4 py-3 hover:bg-hover-bg transition-colors group">
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
      ))}
    </div>
  );
}
