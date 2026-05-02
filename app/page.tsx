import { getAnnouncements } from '@/lib/announcementStore';
import { getImportantLinks } from '@/lib/importantLinkStore';
import { AnnouncementsPanel } from '@/components/home/AnnouncementsPanel';
import { ImportantLinks } from '@/components/home/ImportantLinks';
import { UpdatesTicker } from '@/components/home/UpdatesTicker';
import { HeroBanner } from '@/components/home/HeroBanner';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [announcements, importantLinks] = await Promise.all([
    getAnnouncements(),
    getImportantLinks()
  ]);

  const activeAnnouncements = announcements.filter(a => a.status === 'Active');

  return (
    <div className="flex flex-col gap-6">
      <UpdatesTicker announcements={activeAnnouncements.slice(0, 5)} />
      <HeroBanner />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <AnnouncementsPanel announcements={activeAnnouncements.slice(0, 5)} />
        </div>
        <div className="flex flex-col gap-6">
          <ImportantLinks links={importantLinks} />
        </div>
      </div>
    </div>
  );
}
