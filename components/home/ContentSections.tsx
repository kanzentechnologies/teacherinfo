import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const sections = [
  {
    title: 'Study Materials',
    items: [
      { title: 'Mathematics Class 10 Important Questions', date: '12 Apr 2024' },
      { title: 'Science Biology Notes for TET', date: '10 Apr 2024' },
      { title: 'English Grammar Comprehensive Guide', date: '08 Apr 2024' },
      { title: 'General Knowledge 2024 Capsule', date: '05 Apr 2024' },
    ],
    link: '/category/study-materials'
  },
  {
    title: 'Previous Papers',
    items: [
      { title: 'AP DSC 2018 Question Paper with Key', date: '11 Apr 2024' },
      { title: 'TET 2022 Paper 1 & 2', date: '09 Apr 2024' },
      { title: 'SSC CGL Tier 1 Previous Papers', date: '07 Apr 2024' },
      { title: 'RRB NTPC 2019 Question Papers', date: '04 Apr 2024' },
    ],
    link: '/category/previous-papers'
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
                <Link href="#" className="block px-4 py-3 hover:bg-hover-bg transition-colors group">
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
