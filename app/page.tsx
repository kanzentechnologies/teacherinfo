import { HeroBanner } from '@/components/home/HeroBanner';
import { UpdatesTicker } from '@/components/home/UpdatesTicker';
import { QuickLinks } from '@/components/home/QuickLinks';
import { ContentSections } from '@/components/home/ContentSections';
import { AnnouncementsPanel } from '@/components/home/AnnouncementsPanel';
import { ImportantLinks } from '@/components/home/ImportantLinks';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <UpdatesTicker />
      <HeroBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <QuickLinks />
          <AdPlaceholder format="fluid" className="w-full h-[150px] border-primary/20 bg-primary/5" label="In-feed Advertisement" />
          <ContentSections />
        </div>
        <div className="flex flex-col gap-6">
          <AnnouncementsPanel />
          <ImportantLinks />
          <div className="sticky top-6">
            <AdPlaceholder format="rectangle" />
          </div>
        </div>
      </div>
    </div>
  );
}
