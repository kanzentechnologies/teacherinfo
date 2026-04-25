'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const adminLinks = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Single Pages', href: '/admin/pages' },
  { name: 'Content Categories', href: '/admin/categories' },
  { name: 'Posts & Updates', href: '/admin/posts' },
  { name: 'Announcements', href: '/admin/announcements' },
  { name: 'Navigation Menu', href: '/admin/navbar' },
  { name: 'Contact Management', href: '/admin/contact' },
  { name: 'Useful Links', href: '/admin/quick-links' },
  { name: 'Homepage Icons', href: '/admin/homepage-quick-links' },
  { name: 'Service Management', href: '/admin/services' },
  { name: 'Important Links', href: '/admin/important-links' },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

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
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-3 text-sm border-b border-white/10 hover:bg-red-700 text-red-200 transition-colors mt-8"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
