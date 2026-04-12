import Link from 'next/link';
import { Calculator, FileText, Monitor, ClipboardList, BookOpen, Briefcase } from 'lucide-react';

const links = [
  { name: 'Income Tax', icon: Calculator, href: '/category/income-tax', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'GO’s & Proceedings', icon: FileText, href: '/category/gos-and-proceedings', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Softwares', icon: Monitor, href: '/category/softwares', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Forms', icon: ClipboardList, href: '/category/forms', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Academics', icon: BookOpen, href: '/category/academics', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { name: 'Services', icon: Briefcase, href: '/category/services', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export function QuickLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link 
            key={link.name} 
            href={link.href}
            className={`border p-4 flex flex-col items-center justify-center gap-3 text-center transition-colors hover:shadow-md ${link.color}`}
          >
            <Icon size={32} />
            <span className="font-bold text-sm">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
