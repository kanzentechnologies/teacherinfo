import { supabase } from './supabase';

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'Published' | 'Draft';
  created_at?: string;
}

export const getPages = async (): Promise<PageItem[]> => {
  const { data, error } = await supabase.from('posts').select('*').eq('type', 'page');
  if (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
  return data?.map(d => ({
    id: d.id,
    title: d.title,
    slug: d.slug,
    content: d.content,
    status: d.status,
    created_at: d.created_at
  })) || [];
};

export const getPageBySlug = async (slug: string): Promise<PageItem | null> => {
  const { data, error } = await supabase.from('posts').select('*').eq('type', 'page').eq('slug', slug).single();
  if (error) {
    if (!error.message?.includes('0 rows')) {
      console.error('Error fetching page:', error);
    }
    return null;
  }
  return data ? {
    id: data.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    status: data.status,
    created_at: data.created_at
  } : null;
};

export const getPageById = async (id: string): Promise<PageItem | null> => {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
  if (error) return null;
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    status: data.status,
    created_at: data.created_at
  };
};

export const savePage = async (page: PageItem): Promise<void> => {
  const post = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    category_slug: 'pages',
    content: page.content,
    status: page.status,
    date: new Date().toISOString(),
    type: 'page',
  };
  const { error } = await supabase.from('posts').upsert(post, { onConflict: 'id' });
  if (error) throw new Error(error.message);
};

export const deletePage = async (id: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
