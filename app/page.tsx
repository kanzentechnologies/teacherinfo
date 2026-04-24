import { HeroBanner } from '@/components/home/HeroBanner';
import { UpdatesTicker } from '@/components/home/UpdatesTicker';
import { QuickLinks } from '@/components/home/QuickLinks';
import { ContentSections } from '@/components/home/ContentSections';
import { AnnouncementsPanel } from '@/components/home/AnnouncementsPanel';
import { ImportantLinks } from '@/components/home/ImportantLinks';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';
import { getPages } from '@/lib/pageStore';
import { getCategories } from '@/lib/categoryStore';
import { getAnnouncements } from '@/lib/announcementStore';
import { getImportantLinks } from '@/lib/importantLinkStore';
import { getQuickLinks } from '@/lib/quickLinkStore';

export default async function Home() {
  const [pages, categories, announcements, importantLinks, quickLinks] = await Promise.all([
    getPages(),
    getCategories(),
    getAnnouncements(),
    getImportantLinks(),
    getQuickLinks()
  ]);

  const publishedPages = pages.filter(p => p.status === 'Published');
  const recentPages = [...publishedPages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const activeAnnouncements = announcements.filter(a => a.status === 'Active');

  return (
    <div className="flex flex-col gap-6">
      <UpdatesTicker announcements={activeAnnouncements.slice(0, 5)} />
      <HeroBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <QuickLinks links={quickLinks} />
          <AdPlaceholder format="fluid" className="w-full h-[150px] border-primary/20 bg-primary/5" label="In-feed Advertisement" />
          <ContentSections categories={categories} pages={recentPages} />
        </div>
        <div className="flex flex-col gap-6">
          <AnnouncementsPanel announcements={activeAnnouncements.slice(0, 5)} />
          <ImportantLinks links={importantLinks} />
          <div className="sticky top-6">
            <AdPlaceholder format="rectangle" />
          </div>
        </div>
      </div>
    </div>
  );
}
