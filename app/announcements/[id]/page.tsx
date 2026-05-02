import React from "react";
import { getAnnouncements } from "@/lib/announcementStore";
import Link from "next/link";
import { Bell, Calendar, ChevronLeft, Share2 } from "lucide-react";
import { EmbedIframe } from "@/components/ui/EmbedIframe";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/ui/PrintButton";

export const revalidate = 60;

export async function generateStaticParams() {
  const announcements = await getAnnouncements();
  return announcements.map((a) => ({
    id: a.id.toString(),
  }));
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const announcements = await getAnnouncements();
  const announcement = announcements.find(
    (a) => a.id.toString() === resolvedParams.id,
  );

  if (!announcement || (!announcement.content && !announcement.embed_link)) {
    notFound();
  }

  return (
    <div className="bg-white border border-border-main p-6 md:p-10 max-w-4xl mx-auto mt-6">
      <div className="mb-6">
        <Link
          href="/announcements"
          className="text-secondary hover:underline flex items-center gap-1 text-sm font-bold"
        >
          <ChevronLeft size={16} /> All Announcements
        </Link>
      </div>

      <header className="border-b border-border-main pb-6 mb-8">
        <div className="flex items-center gap-2 text-accent bg-primary/5 py-1 px-3 rounded-full w-fit mb-4">
          <Bell size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Announcement
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight break-words">
          {announcement.title}
        </h1>

        <div className="flex items-center gap-4 text-text-muted text-sm">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{announcement.date}</span>
          </div>
          {announcement.priority === "High" && (
            <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-sm font-bold border border-red-200">
              HIGH PRIORITY
            </span>
          )}
        </div>
      </header>

      {announcement.content && (
        <div
          className="prose prose-blue max-w-none text-text-main break-words overflow-hidden"
          dangerouslySetInnerHTML={{ __html: announcement.content }}
        />
      )}

      {announcement.embed_link && (
        <EmbedIframe url={announcement.embed_link} title={announcement.title} />
      )}

      {announcement.link && (
        <div className="mt-10 p-6 bg-gray-50 border border-border-main rounded-sm">
          <h3 className="font-bold text-primary mb-2">Related Link</h3>
          <a
            href={announcement.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline break-all flex items-center gap-2"
          >
            {announcement.link}
          </a>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-border-main flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-bold text-text-muted mr-2 flex items-center gap-1"><Share2 size={16} /> Share:</span>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(announcement.title)} - https://www.teacherinfo.net/announcements/${announcement.id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
            WhatsApp
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.teacherinfo.net/announcements/${announcement.id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#1877F2] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
            Facebook
          </a>
          <a href={`https://twitter.com/intent/tweet?url=https://www.teacherinfo.net/announcements/${announcement.id}&text=${encodeURIComponent(announcement.title)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#1DA1F2] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
            Twitter
          </a>
          <a href={`https://t.me/share/url?url=https://www.teacherinfo.net/announcements/${announcement.id}&text=${encodeURIComponent(announcement.title)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#0088cc] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
            Telegram
          </a>
        </div>
        <PrintButton />
      </div>

      <div className="mt-12 pt-8 border-t border-border-main">
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-sm hover:bg-primary/90 transition-colors"
        >
          <ChevronLeft size={18} /> View More Announcements
        </Link>
      </div>
    </div>
  );
}
