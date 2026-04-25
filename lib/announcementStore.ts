import { supabase } from './supabase';

export type Announcement = {
  id: number;
  title: string;
  date: string;
  priority: 'High' | 'Normal';
  status: 'Active' | 'Inactive';
  link?: string;
};

export const defaultAnnouncements: Announcement[] = [
  { id: 1, title: 'AP DSC 2024 Notification Released', date: '2024-04-12', priority: 'High', status: 'Active', link: '' },
  { id: 2, title: 'TET 2024 Results Declared', date: '2024-04-10', priority: 'High', status: 'Active', link: '' },
  { id: 3, title: 'New Study Materials for Mathematics Uploaded', date: '2024-04-08', priority: 'Normal', status: 'Active', link: '' },
  { id: 4, title: 'SSC CGL 2024 Exam Dates Announced', date: '2024-04-05', priority: 'Normal', status: 'Inactive', link: '' },
];

let cachedAnnouncements = [...defaultAnnouncements];

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const { data, error } = await supabase.from('announcements').select('*').order('id', { ascending: false });
  if (error) {
    console.error('Error fetching data:', error.message || error);
    return cachedAnnouncements;
  }
  
  if (data && data.length > 0) {
    cachedAnnouncements = data as Announcement[];
  }
  return cachedAnnouncements;
};

export const saveAnnouncement = async (announcement: Partial<Announcement>): Promise<void> => {
  const { error } = await supabase.from('announcements').upsert([announcement], { onConflict: 'id' });
  if (error) {
    console.error('Error fetching data:', error.message || error);
    
    // Fallback to local cache
    const existingIndex = cachedAnnouncements.findIndex(a => a.id === announcement.id);
    if (existingIndex >= 0) {
      cachedAnnouncements[existingIndex] = { ...cachedAnnouncements[existingIndex], ...announcement } as Announcement;
    } else {
      cachedAnnouncements.unshift({
        id: announcement.id || Math.floor(Math.random() * 100000),
        title: announcement.title || '',
        date: announcement.date || new Date().toISOString().split('T')[0],
        priority: announcement.priority || 'Normal',
        status: announcement.status || 'Active',
        link: announcement.link
      });
    }
  }
};

export const deleteAnnouncement = async (id: number): Promise<void> => {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) {
    console.error('Error fetching data:', error.message || error);
    
    // Fallback to local cache
  }
  cachedAnnouncements = cachedAnnouncements.filter(a => a.id !== id);
};
