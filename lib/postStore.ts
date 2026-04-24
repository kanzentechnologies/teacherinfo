import { supabase } from './supabase';

export type Post = {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  content: string;
  status: 'Published' | 'Draft';
  date: string;
  type: 'Article' | 'PDF';
  fileUrl?: string;
  fileSize?: string;
};

export const defaultPosts: Post[] = [
  { 
    id: '123e4567-e89b-12d3-a456-426614174001', 
    title: 'Useful Link Example 1', 
    slug: 'useful-link-1', 
    categorySlug: 'useful-links', 
    content: '<p>Content for useful link 1</p>', 
    status: 'Published', 
    date: '2024-04-12', 
    type: 'Article' 
  },
];

let cachedPosts = [...defaultPosts];

export const getPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error fetching posts:', error.message || error);
    }
    return cachedPosts;
  }
  
  if (data && data.length > 0) {
    cachedPosts = data as Post[];
  }
  return cachedPosts;
};

export const getPostsByCategory = async (categorySlug: string): Promise<Post[]> => {
  const posts = await getPosts();
  return posts.filter(p => p.categorySlug === categorySlug);
};

export const savePosts = async (posts: Post[]): Promise<void> => {
  const { error } = await supabase.from('posts').upsert(posts, { onConflict: 'id' });
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error saving posts:', error.message || error);
    }
  }
  cachedPosts = [...posts];
};

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error deleting post:', error.message || error);
    }
  }
  cachedPosts = cachedPosts.filter(p => p.id !== id);
};
