import { defaultPages } from '@/lib/pageStore';
import CustomPageClient from './client-page';

export function generateStaticParams() {
  return defaultPages.map((page) => ({
    slug: page.slug.startsWith('/') ? page.slug.substring(1) : page.slug,
  }));
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CustomPageClient slug={resolvedParams.slug} />;
}
