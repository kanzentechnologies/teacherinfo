export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  count: number;
};

export const defaultCategories: Category[] = [
  { id: '1', name: 'Useful Links', slug: 'useful-links', description: '', parentId: null, count: 12 },
  { id: '2', name: 'Income Tax', slug: 'income-tax', description: '', parentId: null, count: 5 },
  { id: '3', name: 'GO’s & Proceedings', slug: 'gos-and-proceedings', description: '', parentId: null, count: 45 },
  { id: '4', name: 'Softwares', slug: 'softwares', description: '', parentId: null, count: 8 },
  { id: '5', name: 'Forms', slug: 'forms', description: '', parentId: null, count: 24 },
  { id: '6', name: 'Academics', slug: 'academics', description: '', parentId: null, count: 156 },
  { id: '7', name: 'Services', slug: 'services', description: '', parentId: null, count: 10 },
];

export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return defaultCategories;
  const stored = localStorage.getItem('site_categories');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse categories from localStorage', e);
    }
  }
  return defaultCategories;
};

export const saveCategories = (categories: Category[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('site_categories', JSON.stringify(categories));
  }
};
