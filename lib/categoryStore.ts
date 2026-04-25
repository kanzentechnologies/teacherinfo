import { supabase } from './supabase';

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  count: number;
};

export const defaultCategories: Category[] = [
  { id: 'c9f0f895-f30b-4b13-8b7a-c4ad3d4f8f42', name: 'Useful Links', slug: 'useful-links', description: '', parentId: null, count: 12 },
  { id: 'a4d5b6e7-1c2d-4e3f-9a8b-7c6d5e4f3a2b', name: 'Income Tax', slug: 'income-tax', description: '', parentId: null, count: 5 },
  { id: 'e1f2a3b4-5c6d-4e7f-8a9b-0c1d2e3f4a5b', name: 'GO’s & Proceedings', slug: 'gos-and-proceedings', description: '', parentId: null, count: 45 },
  { id: '6a7b8c9d-0e1f-4a2b-3c4d-5e6f7a8b9c0d', name: 'Softwares', slug: 'softwares', description: '', parentId: null, count: 8 },
  { id: 'f0e1d2c3-b4a5-4968-7a8b-9c0d1e2f3a4b', name: 'Forms', slug: 'forms', description: '', parentId: null, count: 24 },
  { id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', name: 'Academics', slug: 'academics', description: '', parentId: null, count: 156 },
  { id: '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d', name: 'Services', slug: 'services', description: '', parentId: null, count: 10 },
];

let cachedCategories = [...defaultCategories];

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error('Error fetching data:', error.message || error);
    return cachedCategories;
  }
  
  if (data && data.length > 0) {
    cachedCategories = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      parentId: row.parent_id,
      count: row.count
    })) as Category[];
  }
  return cachedCategories;
};

export const saveCategories = async (categories: Category[]): Promise<void> => {
  const mapped = categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    parent_id: c.parentId,
    count: c.count
  }));
  const { error } = await supabase.from('categories').upsert(mapped, { onConflict: 'id' });
  if (error) {
    console.error('Error in write:', error.message || error);
    throw new Error(error.message || 'Write error');
  }
  cachedCategories = [...categories];
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    console.error('Error in write:', error.message || error);
    throw new Error(error.message || 'Write error');
  }
  cachedCategories = cachedCategories.filter(c => c.id !== id);
};
