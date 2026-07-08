import { getAnnouncements } from '@/lib/announcementStore';
import { getImportantLinks } from '@/lib/importantLinkStore';
import { getPageBySlug } from '@/lib/pageStore';
import { AnnouncementsPanel } from '@/components/home/AnnouncementsPanel';
import { ImportantLinks } from '@/components/home/ImportantLinks';
import { QuickLinks } from '@/components/home/QuickLinks';
import { UpdatesTicker } from '@/components/home/UpdatesTicker';
import { HeroBanner } from '@/components/home/HeroBanner';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [announcements, importantLinks, usefulLinksPage] = await Promise.all([
    getAnnouncements(),
    getImportantLinks(),
    getPageBySlug('useful-links')
  ]);

  const activeAnnouncements = announcements.filter(a => a.status === 'Active');

  let quickLinks = [];
  if (usefulLinksPage && usefulLinksPage.content) {
    try {
      quickLinks = JSON.parse(usefulLinksPage.content);
      // Alphabetical sort like in [...slug]/page.tsx
      quickLinks.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || '', undefined, { numeric: true, sensitivity: 'base' }));
    } catch {
      quickLinks = [];
    }
  }

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
          <QuickLinks links={quickLinks} />
        </div>
      </div>
    </div>
  );
}
