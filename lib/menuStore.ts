export type MenuItem = {
  id: number;
  title: string;
  link: string;
  type: 'internal' | 'external' | 'dropdown' | 'page' | 'category';
  order: number;
  children?: MenuItem[];
};

export const defaultMenu: MenuItem[] = [
  { id: 1, title: 'Home', link: '/', type: 'internal', order: 1, children: [] },
  { id: 2, title: 'Useful Links', link: '/category/useful-links', type: 'internal', order: 2, children: [] },
  { id: 3, title: 'Income Tax', link: '/category/income-tax', type: 'internal', order: 3, children: [] },
  { 
    id: 4, 
    title: 'Resources', 
    link: '#', 
    type: 'dropdown', 
    order: 4, 
    children: [
      { id: 41, title: 'GO’s & Proceedings', link: '/category/gos-and-proceedings', type: 'internal', order: 1 },
      { id: 42, title: 'Softwares', link: '/category/softwares', type: 'internal', order: 2 },
      { id: 43, title: 'Forms', link: '/category/forms', type: 'internal', order: 3 },
    ] 
  },
  { id: 5, title: 'Academics', link: '/category/academics', type: 'internal', order: 5, children: [] },
  { id: 6, title: 'Services', link: '/category/services', type: 'internal', order: 6, children: [] },
  { id: 7, title: 'Contact Us', link: '/contact', type: 'internal', order: 7, children: [] },
];

export const getMenu = (): MenuItem[] => {
  if (typeof window === 'undefined') return defaultMenu;
  const stored = localStorage.getItem('navbar_menu');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse menu from localStorage', e);
    }
  }
  return defaultMenu;
};

export const saveMenu = (menu: MenuItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('navbar_menu', JSON.stringify(menu));
  }
};
