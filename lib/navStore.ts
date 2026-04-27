import { supabase } from './supabase';

export interface NavItem {
  id: string;
  title: string;
  slug: string;
  parent_id: string | null;
  is_page: boolean;
  content: string;
  order_index: number;
  status: 'Published' | 'Draft';
  externalUrl?: string; // if it's purely an external link
  created_at?: string;
  // UI helper
  children?: NavItem[];
}

export const getNavItems = async (): Promise<NavItem[]> => {
  const { data, error } = await supabase.from('nav_items').select('*').order('order_index');
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error fetching nav items:', error.message || error);
    }
    return [];
  }
  return data as NavItem[];
};

export const getNavTree = async (): Promise<NavItem[]> => {
  const items = await getNavItems();
  const map = new Map<string, NavItem>();
  const top: NavItem[] = [];

  items.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  map.forEach(item => {
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children!.push(item);
    } else {
      top.push(item);
    }
  });

  return top.sort((a, b) => a.order_index - b.order_index).map(t => {
    if (t.children) {
      t.children.sort((a, b) => a.order_index - b.order_index);
    }
    return t;
  });
};

export const getNavItemBySlug = async (slugPath: string): Promise<NavItem | null> => {
  // if slugPath is nested, we might just look up the final slug since slugs are unique
  const slugs = slugPath.split('/');
  const lastSlug = slugs[slugs.length - 1];
  
  const { data, error } = await supabase.from('nav_items').select('*').eq('slug', lastSlug).single();
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table') && !error.message?.includes('0 rows')) {
      console.error('Error fetching nav item by slug:', error.message || error);
    }
    return null;
  }
  return data as NavItem;
};

export const saveNavItems = async (items: NavItem[]): Promise<void> => {
  const cleanItems = items.map(item => {
    const { children, ...rest } = item;
    return rest;
  });
  const { error } = await supabase.from('nav_items').upsert(cleanItems, { onConflict: 'id' });
  if (error) {
    console.error('Error saving nav items:', error.message || error);
    throw new Error(error.message || 'Error occurred');
  }
};

export const saveNavItem = async (item: NavItem): Promise<void> => {
  const { children, ...cleanItem } = item;
  const { error } = await supabase.from('nav_items').upsert([cleanItem], { onConflict: 'id' });
  if (error) {
    console.error('Error saving nav item:', error.message || error);
    throw new Error(error.message || 'Error occurred');
  }
};

export const deleteNavItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from('nav_items').delete().eq('id', id);
  if (error) {
    console.error('Error deleting nav item:', error.message || error);
    throw new Error(error.message || 'Error occurred');
  }
};
