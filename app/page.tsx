import { HeroBanner } from '@/components/home/HeroBanner';
import { UpdatesTicker } from '@/components/home/UpdatesTicker';
import { QuickLinks } from '@/components/home/QuickLinks';
import { ContentSections } from '@/components/home/ContentSections';
import { AnnouncementsPanel } from '@/components/home/AnnouncementsPanel';
import { ImportantLinks } from '@/components/home/ImportantLinks';
import { getNavTree } from '@/lib/navStore';
import { getAnnouncements } from '@/lib/announcementStore';
import { getImportantLinks } from '@/lib/importantLinkStore';
import { getQuickLinks } from '@/lib/quickLinkStore';

export default async function Home() {
  const [navItems, announcements, importantLinks, quickLinks] = await Promise.all([
    getNavTree(),
    getAnnouncements(),
    getImportantLinks(),
    getQuickLinks()
  ]);

  const activeAnnouncements = announcements.filter(a => a.status === 'Active');

  return (
    <div className="flex flex-col gap-6">
      <UpdatesTicker announcements={activeAnnouncements.slice(0, 5)} />
      <HeroBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <QuickLinks links={quickLinks} />
          <ContentSections navItems={navItems} />
        </div>
        <div className="flex flex-col gap-6">
          <AnnouncementsPanel announcements={activeAnnouncements.slice(0, 5)} />
          <ImportantLinks links={importantLinks} />
        </div>
      </div>
    </div>
  );
}
