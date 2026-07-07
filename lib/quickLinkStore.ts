import { supabase } from './supabase';

export type QuickLinkType = {
  id: number;
  title: string;
  link: string;
  order: number;
};

export const defaultQuickLinks: QuickLinkType[] = [
  { id: 1, title: 'Income Tax', link: '/category/income-tax', order: 1 },
  { id: 2, title: 'GO\'s & Proceedings', link: '/category/gos-and-proceedings', order: 2 },
  { id: 3, title: 'Softwares', link: '/category/softwares', order: 3 },
  { id: 4, title: 'Forms', link: '/category/forms', order: 4 },
  { id: 5, title: 'Academics', link: '/category/academics', order: 5 },
  { id: 6, title: 'Services', link: '/services', order: 6 },
];

let cachedLinks = [...defaultQuickLinks];

export const getQuickLinks = async (): Promise<QuickLinkType[]> => {
  const { data, error } = await supabase.from('quick_links').select('*').order('order');
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error fetching data:', error.message || error);
    }
    return cachedLinks;
  }
  
  if (data) {
    cachedLinks = data.map((d: any) => ({
      ...d,
      link: d.url || d.link
    })) as QuickLinkType[];
  }
  return cachedLinks;
};

export const saveQuickLinks = async (links: QuickLinkType[]): Promise<void> => {
  // Map 'link' to 'url' for database compatibility and omit 'link'
  const linksToSave = links.map(({ link, ...rest }) => ({
    ...rest,
    url: link
  }));
  const { error } = await supabase.from('quick_links').upsert(linksToSave, { onConflict: 'id' });
  if (error) {
    console.error('Error in write:', error.message || error);
    throw new Error(error.message || 'Write error');
  }
  cachedLinks = [...links];
};

export const deleteQuickLink = async (id: number): Promise<void> => {
  const { error } = await supabase.from('quick_links').delete().eq('id', id);
  if (error) {
    console.error('Error in write:', error.message || error);
    throw new Error(error.message || 'Write error');
  }
  cachedLinks = cachedLinks.filter(l => l.id !== id);
};
