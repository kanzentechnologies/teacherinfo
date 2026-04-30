import { getAnnouncements } from '@/lib/announcementStore';
import { getImportantLinks } from '@/lib/importantLinkStore';
import { getPages } from '@/lib/pageStore';
import { AnnouncementsPanel } from '@/components/home/AnnouncementsPanel';
import { ImportantLinks } from '@/components/home/ImportantLinks';
import { PagesPanel } from '@/components/home/PagesPanel';
import { UpdatesTicker } from '@/components/home/UpdatesTicker';
import { HeroBanner } from '@/components/home/HeroBanner';

export default async function Home() {
  const [announcements, importantLinks, pages] = await Promise.all([
    getAnnouncements(),
    getImportantLinks(),
    getPages()
  ]);

  const activeAnnouncements = announcements.filter(a => a.status === 'Active');
  const publishedPages = pages.filter(p => p.status === 'Published');

  return (
    <div className="flex flex-col gap-6">
      <UpdatesTicker announcements={activeAnnouncements.slice(0, 5)} />
      <HeroBanner />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6">
          <AnnouncementsPanel announcements={activeAnnouncements.slice(0, 5)} />
        </div>
        <div className="flex flex-col gap-6">
          <ImportantLinks links={importantLinks} />
        </div>
        <div className="flex flex-col gap-6">
          <PagesPanel pages={publishedPages.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
