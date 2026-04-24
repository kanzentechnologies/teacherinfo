import Link from 'next/link';
import { Calculator, FileText, Monitor, ClipboardList, BookOpen, Briefcase, LucideIcon, Folder, Link as LinkIcon } from 'lucide-react';
import { QuickLinkType } from '@/lib/quickLinkStore';

const iconMap: Record<string, LucideIcon> = {
  'Calculator': Calculator,
  'FileText': FileText,
  'Monitor': Monitor,
  'ClipboardList': ClipboardList,
  'BookOpen': BookOpen,
  'Briefcase': Briefcase,
  'Link': LinkIcon
};

const colorClasses: Record<string, string> = {
  'blue': 'bg-blue-50 text-blue-700 border-blue-200',
  'green': 'bg-green-50 text-green-700 border-green-200',
  'purple': 'bg-purple-50 text-purple-700 border-purple-200',
  'orange': 'bg-orange-50 text-orange-700 border-orange-200',
  'teal': 'bg-teal-50 text-teal-700 border-teal-200',
  'rose': 'bg-rose-50 text-rose-700 border-rose-200',
  'gray': 'bg-gray-50 text-gray-700 border-gray-200',
};

export function QuickLinks({ links }: { links: QuickLinkType[] }) {
  if (!links || links.length === 0) return null;
  const displayLinks = links.slice(0, 12);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {displayLinks.map((item) => {
        const Icon = iconMap[item.icon] || Folder;
        const color = colorClasses[item.color] || colorClasses['gray'];
        return (
          <Link 
            key={item.id} 
            href={item.link}
            className={`border p-4 flex flex-col items-center justify-center gap-3 text-center transition-colors hover:shadow-md ${color}`}
          >
            <Icon size={32} />
            <span className="font-bold text-sm">{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
