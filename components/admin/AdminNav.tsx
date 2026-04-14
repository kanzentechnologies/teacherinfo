'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Posts', href: '/admin/posts' },
  { name: 'Pages', href: '/admin/pages' },
  { name: 'Categories', href: '/admin/categories' },
  { name: 'Announcements', href: '/admin/announcements' },
  { name: 'Navbar Menu', href: '/admin/navbar' },
  { name: 'Contact Management', href: '/admin/contact' },
  { name: 'Service Management', href: '/admin/services' },
  { name: 'Files', href: '/admin/files' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="bg-primary text-white w-full md:w-64 flex-shrink-0 md:min-h-[calc(100vh-200px)]">
      <div className="p-4 font-bold border-b border-white/20">
        Admin Menu
      </div>
      <ul className="flex flex-col">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`block px-4 py-3 text-sm border-b border-white/10 hover:bg-secondary transition-colors ${
                  isActive ? 'bg-secondary font-bold border-l-4 border-accent' : ''
                }`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/admin"
            className="block px-4 py-3 text-sm border-b border-white/10 hover:bg-red-700 text-red-200 transition-colors mt-8"
          >
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}
