import { supabase } from './supabase';

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

let cachedMenu = [...defaultMenu];

export const getMenu = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase.from('menu_items').select('*').order('order');
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error fetching menu:', error.message || error);
    }
    return cachedMenu;
  }
  
  if (data && data.length > 0) {
    try {
      const topLevel = data.filter(item => !item.parent_id).sort((a,b) => a.order - b.order);
      const builtMenu = topLevel.map(t => {
        const children = data.filter(c => c.parent_id === t.id).sort((a,b) => a.order - b.order);
        return {
          id: t.id,
          title: t.title,
          link: t.link,
          type: t.type as any,
          order: t.order,
          children: children.map(c => ({
            id: c.id,
            title: c.title,
            link: c.link,
            type: c.type as any,
            order: c.order,
          }))
        };
      });
      if (builtMenu.length > 0) {
        cachedMenu = builtMenu;
      }
    } catch(e) {
      console.error(e);
    }
  }
  return cachedMenu;
};

export const saveMenu = async (menu: MenuItem[]): Promise<void> => {
  await supabase.from('menu_items').delete().neq('id', 0); // Delete all
  
  const flatData: any[] = [];
  menu.forEach((item, index) => {
    const parentId = item.id || (Math.floor(Math.random() * 100000000));
    flatData.push({
      id: parentId, // using standard int mapping 
      title: item.title,
      link: item.link,
      type: item.type,
      order: item.order || index,
      parent_id: null
    });
    if (item.children) {
      item.children.forEach((child, cIndex) => {
        flatData.push({
          id: child.id || (Math.floor(Math.random() * 100000000)),
          title: child.title,
          link: child.link,
          type: child.type,
          order: child.order || cIndex,
          parent_id: parentId
        });
      });
    }
  });

  const { error } = await supabase.from('menu_items').insert(flatData);
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error saving menu:', error.message || error);
    }
  }
  cachedMenu = [...menu];
};
