import { Announcement } from '@/lib/announcementStore';

export function UpdatesTicker({ announcements }: { announcements: Announcement[] }) {
  if (!announcements || announcements.length === 0) return null;
  return (
    <div className="bg-white border border-border-main flex items-center shadow-sm relative overflow-hidden h-10">
      <div className="bg-accent text-primary font-bold px-4 py-2 whitespace-nowrap z-10 flex-shrink-0 h-full flex items-center shadow-md">
        Latest Updates
      </div>
      <div className="overflow-hidden relative w-full h-full flex items-center">
        {/* In a real app, this would be an animated ticker. For now, a simple scrolling text or static text */}
        <div className="animate-marquee whitespace-nowrap px-4 text-sm font-medium text-primary">
          {announcements.map((ann, i) => (
            <span key={i} className="mx-4">
              • {ann.link ? <a href={ann.link} className="hover:underline">{ann.title}</a> : ann.title}
              {ann.priority === 'High' && <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-sm animate-pulse">NEW</span>}
            </span>
          ))}
          {announcements.map((ann, i) => (
            <span key={`dup-${i}`} className="mx-4">
              • {ann.link ? <a href={ann.link} className="hover:underline">{ann.title}</a> : ann.title}
              {ann.priority === 'High' && <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-sm animate-pulse">NEW</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
