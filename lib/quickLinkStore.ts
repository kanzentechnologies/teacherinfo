import { supabase } from './supabase';

export type QuickLinkType = {
  id: number;
  title: string;
  link: string;
  icon: string;
  color: string;
  order: number;
};

export const defaultQuickLinks: QuickLinkType[] = [
  { id: 1, title: 'Income Tax', link: '/category/income-tax', icon: 'Calculator', color: 'blue', order: 1 },
  { id: 2, title: 'GO\'s & Proceedings', link: '/category/gos-and-proceedings', icon: 'FileText', color: 'green', order: 2 },
  { id: 3, title: 'Softwares', link: '/category/softwares', icon: 'Monitor', color: 'purple', order: 3 },
  { id: 4, title: 'Forms', link: '/category/forms', icon: 'ClipboardList', color: 'orange', order: 4 },
  { id: 5, title: 'Academics', link: '/category/academics', icon: 'BookOpen', color: 'teal', order: 5 },
  { id: 6, title: 'Services', link: '/category/services', icon: 'Briefcase', color: 'rose', order: 6 },
];

let cachedLinks = [...defaultQuickLinks];

export const getQuickLinks = async (): Promise<QuickLinkType[]> => {
  const { data, error } = await supabase.from('quick_links').select('*').order('order');
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error fetching quick links:', error.message || error);
    }
    return cachedLinks;
  }
  
  if (data && data.length > 0) {
    cachedLinks = data as QuickLinkType[];
  }
  return cachedLinks;
};

export const saveQuickLinks = async (links: QuickLinkType[]): Promise<void> => {
  const { error } = await supabase.from('quick_links').upsert(links, { onConflict: 'id' });
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error saving quick links:', error.message || error);
    }
  }
  cachedLinks = [...links];
};

export const deleteQuickLink = async (id: number): Promise<void> => {
  const { error } = await supabase.from('quick_links').delete().eq('id', id);
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error deleting quick link:', error.message || error);
    }
  }
  cachedLinks = cachedLinks.filter(l => l.id !== id);
};
