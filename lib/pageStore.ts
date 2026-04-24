export type Page = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'Published' | 'Draft';
  date: string;
};

export const defaultPages: Page[] = [
  { id: '1', title: 'About Us', slug: '/about', content: '<p>About us page content...</p>', status: 'Published', date: '2024-01-15' },
  { id: '2', title: 'Contact Us', slug: '/contact', content: '<p>Contact page content...</p>', status: 'Published', date: '2024-02-20' },
];

export const getPages = (): Page[] => {
  if (typeof window === 'undefined') return defaultPages;
  const stored = localStorage.getItem('site_pages');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse pages from localStorage', e);
    }
  }
  return defaultPages;
};

export const savePages = (pages: Page[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('site_pages', JSON.stringify(pages));
  }
};
