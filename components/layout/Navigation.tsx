'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Latest Updates', href: '/category/updates' },
  { 
    name: 'Study Materials', 
    href: '/category/study-materials',
    dropdown: ['Mathematics', 'Science', 'English', 'General Knowledge']
  },
  { 
    name: 'Previous Papers', 
    href: '/category/previous-papers',
    dropdown: ['AP DSC', 'TET', 'SSC', 'Other Exams']
  },
  { 
    name: 'Job Notifications', 
    href: '/category/jobs',
    dropdown: ['Government Jobs', 'Teaching Jobs', 'Private Jobs']
  },
  { name: 'Results', href: '/category/results' },
  { name: 'Downloads', href: '/category/downloads' },
  { name: 'About', href: '/about' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-secondary text-white relative z-50">
      <div className="px-4 sm:px-8 flex justify-between items-center md:hidden py-3">
        <span className="font-bold">Menu</span>
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <ul className={`${isOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row w-full`}>
        {navItems.map((item) => (
          <li 
            key={item.name} 
            className="relative group border-b md:border-b-0 border-primary/20 md:border-r border-primary/30 last:border-r-0"
            onMouseEnter={() => setActiveDropdown(item.name)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link 
              href={item.href}
              className="block px-4 py-3 hover:bg-primary transition-colors flex items-center justify-between md:justify-start gap-1 font-medium text-sm"
            >
              {item.name}
              {item.dropdown && <ChevronDown size={16} className="opacity-70" />}
            </Link>
            
            {item.dropdown && (
              <div 
                className={`
                  md:absolute top-full left-0 bg-white text-text-main border border-border-main shadow-md min-w-[200px]
                  ${activeDropdown === item.name ? 'block' : 'hidden'}
                  md:group-hover:block
                `}
              >
                <ul className="py-2">
                  {item.dropdown.map((subItem) => (
                    <li key={subItem}>
                      <Link 
                        href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 text-sm hover:bg-hover-bg hover:text-primary transition-colors"
                      >
                        {subItem}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
