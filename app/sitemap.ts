import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://teacherinfo.net';

  // Static routes
  const routes = [
    '',
    '/about',
    '/admin',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic category routes
  const categories = ['updates', 'study-materials', 'previous-papers', 'jobs', 'results', 'downloads'];
  const categoryRoutes = categories.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Dynamic content routes (mocked for now)
  const contentRoutes = Array.from({ length: 10 }).map((_, i) => ({
    url: `${baseUrl}/content/${i}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes, ...contentRoutes];
}
