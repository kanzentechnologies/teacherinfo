'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { getNavTree, NavItem } from '@/lib/navStore';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const fetchNav = async () => {
      setNavItems(await getNavTree());
    };
    fetchNav();
    
    // Listen for storage events to update menu across tabs
    const handleStorage = () => {
      fetchNav();
    };
    
    // Custom event for same-tab updates
    const handleMenuUpdate = () => {
      fetchNav();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('menuUpdated', handleMenuUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('menuUpdated', handleMenuUpdate);
    };
  }, []);

  const getUrl = (item: NavItem) => {
    return item.is_page ? `/${item.slug}` : (item.externalUrl || '#');
  };

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
            key={item.id} 
            className="relative group border-b md:border-b-0 border-primary/20 md:border-r border-primary/30 last:border-r-0"
            onMouseEnter={() => setActiveDropdown(item.id)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link 
              href={getUrl(item)}
              className="block px-4 py-3 hover:bg-primary transition-colors flex items-center justify-between md:justify-start gap-1 font-medium text-sm"
              target={!item.is_page && item.externalUrl?.startsWith('http') ? '_blank' : '_self'}
            >
              {item.title}
              {item.children && item.children.length > 0 && <ChevronDown size={16} className="opacity-70" />}
            </Link>
            
            {item.children && item.children.length > 0 && (
              <div 
                className={`
                  md:absolute top-full left-0 bg-white text-text-main border border-border-main shadow-md min-w-[200px]
                  ${activeDropdown === item.id ? 'block' : 'hidden'}
                  md:group-hover:block
                `}
              >
                <ul className="py-2">
                  {item.children.map((subItem) => (
                    <li key={subItem.id}>
                      <Link 
                        href={getUrl(subItem)}
                        className="block px-4 py-2 text-sm hover:bg-hover-bg hover:text-primary transition-colors"
                        target={!subItem.is_page && subItem.externalUrl?.startsWith('http') ? '_blank' : '_self'}
                      >
                        {subItem.title}
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
