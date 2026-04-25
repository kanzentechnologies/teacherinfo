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
        images: [
          {
            url: 'https://firebasestorage.googleapis.com/v0/b/studio-6624311534-29f23.firebasestorage.app/o/logo.png?alt=media&token=79cb88ef-c95b-4959-a8f3-79da6a33f3c4',
            width: 1200,
            height: 630,
            alt: 'Teacher Info Portal',
          }
        ],
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
