export type StaticPage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'Published' | 'Draft';
  lastUpdated: string;
};

const defaultPages: StaticPage[] = [
  { 
    id: '1', 
    title: 'About Us', 
    slug: 'about', 
    content: '<h1>About Teacher Info Portal</h1><p>Teacher Info Portal is a dedicated platform providing the latest updates, study materials, and job notifications for teaching professionals and aspirants.</p>', 
    status: 'Published', 
    lastUpdated: '2024-01-15' 
  },
  { 
    id: '2', 
    title: 'Privacy Policy', 
    slug: 'privacy-policy', 
    content: '<h1>Privacy Policy</h1><p>Your privacy is important to us.</p>', 
    status: 'Published', 
    lastUpdated: '2023-11-05' 
  },
  { 
    id: '3', 
    title: 'Terms of Service', 
    slug: 'terms', 
    content: '<h1>Terms of Service</h1><p>Please read these terms carefully.</p>', 
    status: 'Draft', 
    lastUpdated: '2023-11-05' 
  },
];

export const getPages = (): StaticPage[] => {
  if (typeof window === 'undefined') return defaultPages;
  const stored = localStorage.getItem('static_pages');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse pages from localStorage', e);
    }
  }
  return defaultPages;
};

export const savePages = (pages: StaticPage[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('static_pages', JSON.stringify(pages));
  }
};

export const getPageBySlug = (slug: string): StaticPage | undefined => {
  const pages = getPages();
  return pages.find(p => p.slug === slug);
};
