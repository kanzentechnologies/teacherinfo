import { supabase } from './supabase';

export type ImportantLink = {
  id: number;
  title: string;
  link: string;
  order: number;
};

export const defaultImportantLinks: ImportantLink[] = [
  { id: 1, title: 'Check Income Tax Status', link: '#', order: 1 },
  { id: 2, title: 'Download Salary Certificate', link: '#', order: 2 },
  { id: 3, title: 'EHS Card Status', link: '#', order: 3 },
  { id: 4, title: 'Teacher Transfers 2024 Portal', link: '#', order: 4 },
  { id: 5, title: 'AP CFMS Login', link: '#', order: 5 }
];

let cachedImportantLinks = [...defaultImportantLinks];

export const getImportantLinks = async (): Promise<ImportantLink[]> => {
  const { data, error } = await supabase.from('important_links').select('*').order('order');
  if (error) {
    console.error('Error fetching data:', error.message || error);
    return cachedImportantLinks;
  }
  
  if (data && data.length > 0) {
    cachedImportantLinks = data as ImportantLink[];
  }
  return cachedImportantLinks;
};

export const saveImportantLinks = async (links: ImportantLink[]): Promise<void> => {
  const { error } = await supabase.from('important_links').upsert(links, { onConflict: 'id' });
  if (error) {
    console.error('Error fetching data:', error.message || error);
    
    // Fallback to local cache
  }
  cachedImportantLinks = [...links];
};

export const deleteImportantLink = async (id: number): Promise<void> => {
  const { error } = await supabase.from('important_links').delete().eq('id', id);
  if (error) {
    console.error('Error fetching data:', error.message || error);
    
    // Fallback to local cache
  }
  cachedImportantLinks = cachedImportantLinks.filter(l => l.id !== id);
};
