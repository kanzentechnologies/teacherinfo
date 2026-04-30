import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Announcement } from '@/lib/announcementStore';

export function AnnouncementsPanel({ announcements }: { announcements: Announcement[] }) {
  if (!announcements || announcements.length === 0) return null;
  return (
    <div className="bg-white border border-border-main">
      <div className="bg-secondary text-white px-4 py-3 flex items-center gap-2">
        <Bell size={18} />
        <h3 className="font-bold">Announcements</h3>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {announcements.map((item, index) => {
            const isRecent = new Date().getTime() - new Date(item.date).getTime() < 7 * 24 * 60 * 60 * 1000;
            const isHighPriority = item.priority === 'High';
            
            return (
              <li key={item.id || index} className="flex gap-2 items-start border-b border-border-main pb-3 last:border-0 last:pb-0">
                <div className="mt-1 w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  {item.link ? (
                    <a href={item.link} className="text-sm text-text-main hover:text-primary hover:underline font-medium break-words block">
                      {item.title}
                    </a>
                  ) : (
                    <Link href={`/announcements/${item.id}`} className="text-sm text-text-main hover:text-primary hover:underline font-medium break-words block">
                      {item.title}
                    </Link>
                  )}
                  {(isRecent || isHighPriority) && (
                    <span className="mt-1 inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold animate-pulse">
                      NEW
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 text-right">
          <Link href="/announcements" className="text-sm text-secondary hover:underline font-bold">
            View All Announcements
          </Link>
        </div>
      </div>
    </div>
  );
}
