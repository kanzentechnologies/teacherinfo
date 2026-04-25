import { defaultPages, getPages, Page } from '@/lib/pageStore';
import CustomPageClient from './client-page';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/${slug}`;
  const pages = await getPages();
  const found = pages.find((p: Page) => p.slug === pathname || p.slug === slug || `/${p.slug}` === pathname);

  if (found && found.status === 'Published') {
    return {
      title: found.title,
      description: found.content.substring(0, 150).replace(/<[^>]*>?/gm, ''), // extract first 150 chars as text
      openGraph: {
        title: `${found.title} | Teacher Info Portal`,
        description: found.content.substring(0, 150).replace(/<[^>]*>?/gm, ''),
        url: `/${slug}`,
      },
    };
  }

  return {
    title: 'Page Not Found',
  };
}

export function generateStaticParams() {
  return defaultPages.map((page) => ({
    slug: page.slug.startsWith('/') ? page.slug.substring(1) : page.slug,
  }));
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CustomPageClient slug={resolvedParams.slug} />;
}
