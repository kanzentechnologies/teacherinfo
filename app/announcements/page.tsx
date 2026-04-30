import React from 'react';
import Link from 'next/link';
import { getAnnouncements } from '@/lib/announcementStore';
import { Bell } from 'lucide-react';

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  const activeAnnouncements = announcements.filter(a => a.status === 'Active');

  return (
    <div className="bg-white border border-border-main p-6 max-w-4xl mx-auto mt-6">
      <div className="flex items-center gap-3 border-b border-border-main pb-4 mb-6">
        <div className="p-3 bg-secondary text-white rounded-full">
          <Bell size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">All Announcements</h1>
          <p className="text-sm text-text-muted">Latest updates and notifications</p>
        </div>
      </div>

      <div className="space-y-4">
        {activeAnnouncements.length === 0 ? (
          <div className="text-center py-10 text-text-muted italic">
            No announcements available at the moment.
          </div>
        ) : (
          activeAnnouncements.map((item, index) => {
            const isRecent = new Date().getTime() - new Date(item.date).getTime() < 7 * 24 * 60 * 60 * 1000;
            const isHighPriority = item.priority === 'High';
            
            return (
              <div key={item.id || index} className="flex gap-4 items-start border border-border-main p-4 hover:bg-gray-50 transition-colors">
                <div className="mt-1 w-3 h-3 rounded-full bg-accent flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex-1">
                      {item.link ? (
                        <a href={item.link} className="text-lg text-primary hover:text-secondary hover:underline font-bold">
                          {item.title}
                        </a>
                      ) : (
                        <Link href={`/announcements/${item.id}`} className="text-lg text-primary hover:text-secondary hover:underline font-bold">
                          {item.title}
                        </Link>
                      )}
                      {(isRecent || isHighPriority) && (
                        <span className="ml-2 inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold animate-pulse align-middle">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-text-muted whitespace-nowrap">
                      {item.date}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="mt-8 text-center sm:text-left">
        <Link href="/" className="text-secondary hover:underline font-bold">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
