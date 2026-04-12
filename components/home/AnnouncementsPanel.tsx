import Link from 'next/link';
import { Bell } from 'lucide-react';

const announcements = [
  { title: 'AP DSC 2024 Notification Released', isNew: true },
  { title: 'TET 2024 Results Declared', isNew: true },
  { title: 'New Study Materials for Mathematics Uploaded', isNew: false },
  { title: 'SSC CGL 2024 Exam Dates Announced', isNew: false },
  { title: 'Download Hall Tickets for Upcoming TET', isNew: false },
];

export function AnnouncementsPanel() {
  return (
    <div className="bg-white border border-border-main">
      <div className="bg-secondary text-white px-4 py-3 flex items-center gap-2">
        <Bell size={18} />
        <h3 className="font-bold">Announcements</h3>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {announcements.map((item, index) => (
            <li key={index} className="flex gap-2 items-start border-b border-border-main pb-3 last:border-0 last:pb-0">
              <div className="mt-1 w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
              <div>
                <Link href={`/content/${index + 10}`} className="text-sm text-text-main hover:text-primary hover:underline font-medium">
                  {item.title}
                </Link>
                {item.isNew && (
                  <span className="ml-2 inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold animate-pulse">
                    NEW
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <Link href="/category/gos-and-proceedings" className="text-sm text-secondary hover:underline font-bold">
            View All Announcements
          </Link>
        </div>
      </div>
    </div>
  );
}
