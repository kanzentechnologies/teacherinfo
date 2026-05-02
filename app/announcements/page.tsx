import React from 'react';
import Link from 'next/link';
import { getAnnouncements } from '@/lib/announcementStore';
import { Bell } from 'lucide-react';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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

      <div className="overflow-x-auto shadow-sm">
        <table className="w-full border-collapse border border-border-main text-left bg-white">
          <thead>
            <tr className="bg-gray-100 text-primary border-b border-border-main">
              <th className="p-3 border-r border-border-main w-12 text-center text-sm uppercase tracking-wide">#</th>
              <th className="p-3 border-r border-border-main text-sm uppercase tracking-wide">Title & Status</th>
              <th className="p-3 w-32 border-r border-border-main text-center text-sm uppercase tracking-wide">Date</th>
              <th className="p-3 w-32 text-center text-sm uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeAnnouncements.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted italic">
                  No announcements available at the moment.
                </td>
              </tr>
            ) : (
              activeAnnouncements.map((item, index) => {
                const isRecent = new Date().getTime() - new Date(item.date).getTime() < 7 * 24 * 60 * 60 * 1000;
                const isHighPriority = item.priority === 'High';
                
                return (
                  <tr key={item.id || index} className="border-b border-border-main hover:bg-gray-50 transition-colors group">
                    <td className="p-3 border-r border-border-main text-center font-bold text-gray-500">{index + 1}</td>
                    <td className="p-3 border-r border-border-main">
                      {item.link ? (
                        <a href={item.link} className="text-lg text-primary hover:text-secondary hover:underline font-bold break-words inline-flex items-center gap-2">
                          {item.title}
                        </a>
                      ) : (
                        <Link href={`/announcements/${item.id}`} className="text-lg text-primary hover:text-secondary hover:underline font-bold break-words inline-flex items-center gap-2">
                          {item.title}
                        </Link>
                      )}
                      {(isRecent || isHighPriority) && (
                        <span className="ml-2 inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold animate-pulse align-middle">
                          NEW
                        </span>
                      )}
                    </td>
                    <td className="p-3 border-r border-border-main text-center text-sm text-text-muted whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="p-3 text-center align-middle">
                      {item.link ? (
                        <a href={item.link} className="inline-flex items-center justify-center gap-1 w-full px-3 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-secondary transition-colors uppercase tracking-wide shadow-sm">
                          Visit
                        </a>
                      ) : (
                        <Link href={`/announcements/${item.id}`} className="inline-flex items-center justify-center gap-1 w-full px-3 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-secondary transition-colors uppercase tracking-wide shadow-sm">
                          Read
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 text-center sm:text-left">
        <Link href="/" className="text-secondary hover:underline font-bold">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
