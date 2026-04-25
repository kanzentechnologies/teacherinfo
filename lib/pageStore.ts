import { supabase } from './supabase';

export type Page = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'Published' | 'Draft';
  date: string;
};

export const defaultPages: Page[] = [
  { id: 'd8c47b5c-4384-486a-8d76-5d29035a9632', title: 'About Us', slug: '/about', content: '<p>About us page content...</p>', status: 'Published', date: '2024-01-15' },
  { id: 'f1a92e34-56b7-4981-a2c3-9d04e5f6a7b8', title: 'Contact Us', slug: '/contact', content: '<p>Contact page content...</p>', status: 'Published', date: '2024-02-20' },
];

let cachedPages = [...defaultPages];

export const getPages = async (): Promise<Page[]> => {
  const { data, error } = await supabase.from('pages').select('*');
  if (error) {
    console.error('Error fetching pages:', error.message || error);
    return cachedPages;
  }
  
  if (data) {
    cachedPages = data as Page[];
  }
  return cachedPages;
};

export const savePages = async (pages: Page[]): Promise<void> => {
  const { error } = await supabase.from('pages').upsert(pages, { onConflict: 'id' });
  if (error) {
    console.error('Error saving pages:', error.message || error);
    throw new Error(error.message || 'Error saving pages');
  }
  cachedPages = [...pages];
};

export const deletePage = async (id: string): Promise<void> => {
  const { error } = await supabase.from('pages').delete().eq('id', id);
  if (error) {
    console.error('Error deleting page:', error.message || error);
    throw new Error(error.message || 'Error deleting page');
  }
  cachedPages = cachedPages.filter(p => p.id !== id);
};
