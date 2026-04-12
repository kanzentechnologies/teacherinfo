import { HeroBanner } from '@/components/home/HeroBanner';
import { UpdatesTicker } from '@/components/home/UpdatesTicker';
import { QuickLinks } from '@/components/home/QuickLinks';
import { ContentSections } from '@/components/home/ContentSections';
import { AnnouncementsPanel } from '@/components/home/AnnouncementsPanel';
import { ImportantLinks } from '@/components/home/ImportantLinks';

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <UpdatesTicker />
      <HeroBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <QuickLinks />
          <ContentSections />
        </div>
        <div className="flex flex-col gap-6">
          <AnnouncementsPanel />
          <ImportantLinks />
        </div>
      </div>
    </div>
  );
}
