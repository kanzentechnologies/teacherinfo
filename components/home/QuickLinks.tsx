import Link from 'next/link';
import { BookOpen, FileText, Briefcase, Award, Download, Users } from 'lucide-react';

const links = [
  { name: 'Study Materials', icon: BookOpen, href: '/category/study-materials', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Previous Papers', icon: FileText, href: '/category/previous-papers', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Job Notifications', icon: Briefcase, href: '/category/jobs', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Results', icon: Award, href: '/category/results', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Downloads', icon: Download, href: '/category/downloads', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { name: 'Community', icon: Users, href: '/community', color: 'bg-rose-50 text-rose-700 border-rose-200' },
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
