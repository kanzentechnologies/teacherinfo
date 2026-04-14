export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Useful Links', slug: 'useful-links', description: '', parentId: null },
  { id: '2', name: 'Income Tax', slug: 'income-tax', description: '', parentId: null },
  { id: '3', name: 'GO’s & Proceedings', slug: 'gos-and-proceedings', description: '', parentId: null },
  { id: '4', name: 'Softwares', slug: 'softwares', description: '', parentId: null },
  { id: '5', name: 'Forms', slug: 'forms', description: '', parentId: null },
  { id: '6', name: 'Academics', slug: 'academics', description: '', parentId: null },
  { id: '7', name: 'Services', slug: 'services', description: '', parentId: null },
];

export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return defaultCategories;
  const stored = localStorage.getItem('categories');
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
    localStorage.setItem('categories', JSON.stringify(categories));
  }
};
