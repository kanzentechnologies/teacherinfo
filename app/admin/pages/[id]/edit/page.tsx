import { getPages } from '@/lib/pageStore';
import EditPageClient from './client-page';

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map(p => ({
    id: p.id,
  }));
}

export default function EditPageServer() {
  return <EditPageClient />;
}
