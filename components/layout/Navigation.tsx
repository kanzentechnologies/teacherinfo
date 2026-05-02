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
    // We moved to just using externalUrl for all links. 
    // Fallback to slug for any legacy items not yet modified.
    return item.externalUrl || `/${item.slug}`;
  };

  return (
    <nav className="bg-secondary text-white relative z-50">
      <div className="px-4 sm:px-8 flex justify-between items-center md:hidden py-3">
        <span className="font-bold">Menu</span>
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <ul className={`${isOpen ? 'max-h-[2000px]' : 'max-h-0 md:max-h-none'} transition-all duration-300 ease-in-out overflow-hidden md:overflow-visible md:flex flex-col md:flex-row w-full`}>
        <li className="relative group border-b md:border-b-0 border-primary/20 md:border-r border-primary/30 last:border-r-0">
          <Link 
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 hover:bg-primary transition-colors flex items-center justify-between md:justify-start gap-1 font-medium text-sm"
          >
            Home
          </Link>
        </li>
        {navItems.map((item) => (
          <li 
            key={item.id} 
            className="relative group border-b md:border-b-0 border-primary/20 md:border-r border-primary/30 last:border-r-0"
            onMouseEnter={() => setActiveDropdown(item.id)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex md:block">
              <Link 
                href={getUrl(item)}
                onClick={() => setIsOpen(false)}
                className="w-full block px-4 py-3 hover:bg-primary transition-colors flex items-center justify-between md:justify-start gap-1 font-medium text-sm"
                target={getUrl(item).startsWith('http') ? '_blank' : '_self'}
              >
                {item.title}
                {item.children && item.children.length > 0 && <ChevronDown size={16} className="opacity-70 hidden md:block" />}
              </Link>
              {item.children && item.children.length > 0 && (
                <button
                  onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                  className="px-4 py-3 md:hidden hover:bg-primary border-l border-primary/20 flex items-center justify-center"
                >
                  <ChevronDown size={20} className={`transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
            
            {item.children && item.children.length > 0 && (
              <div 
                className={`
                  md:absolute top-full left-0 bg-white md:text-text-main md:border border-border-main md:shadow-md min-w-[200px]
                  ${activeDropdown === item.id ? 'block' : 'hidden'}
                  md:group-hover:block
                  border-t md:border-t-0 border-primary/20 bg-secondary md:bg-white
                `}
              >
                <ul className="py-0 md:py-2 flex flex-col">
                  {item.children.map((subItem) => (
                    <li key={subItem.id} className="border-b border-primary/20 md:border-none last:border-none">
                      <Link 
                        href={getUrl(subItem)}
                        onClick={() => setIsOpen(false)}
                        className="block px-8 md:px-4 py-3 md:py-2 text-sm text-white/80 md:text-text-main hover:bg-primary md:hover:bg-hover-bg hover:text-white md:hover:text-primary transition-colors"
                        target={getUrl(subItem).startsWith('http') ? '_blank' : '_self'}
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
