import { supabase } from './supabase';

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  created_at?: string;
}

export const getFiles = async (): Promise<FileItem[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('type', 'file')
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching files:', error);
    return [];
  }
  
  return data?.map(d => {
    let metadata;
    try {
      metadata = typeof d.content === 'string' ? JSON.parse(d.content) : d.content;
    } catch {
      metadata = {};
    }
    return {
      id: d.id,
      name: d.title,
      type: metadata?.type || 'Unknown',
      size: metadata?.size || 0,
      url: metadata?.url || '',
      created_at: d.created_at || d.date,
    };
  }) || [];
};

export const saveFileRecord = async (file: FileItem): Promise<void> => {
  const post = {
    id: file.id,
    title: file.name,
    slug: `file-${file.id}`,
    categorySlug: 'file',
    content: JSON.stringify({
      type: file.type,
      size: file.size,
      url: file.url
    }),
    status: 'Published',
    date: new Date().toISOString(),
    type: 'file',
  };
  const { error } = await supabase.from('posts').upsert(post, { onConflict: 'id' });
  if (error) throw new Error(error.message);
};

export const deleteFileRecord = async (id: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
