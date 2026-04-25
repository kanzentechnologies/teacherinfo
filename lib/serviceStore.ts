import { supabase } from './supabase';

export type Service = {
  id: number;
  title: string;
  description: string;
  link: string;
  order: number;
};

export const defaultServices: Service[] = [
  {
    id: 1,
    title: 'Income Tax Returns',
    description: 'ITR E - FILING',
    link: 'https://wa.me/+919849036590?text=Income%20Tax%20-%20ITR%20Services',
    order: 1
  },
  {
    id: 2,
    title: 'EHS Services',
    description: 'Employees Health Scheme Services',
    link: 'https://wa.me/+919849036590?text=Employees%20Health%20Scheme%20Services',
    order: 2
  },
  {
    id: 3,
    title: 'CCTV Installation',
    description: 'CCTV Connections & Installment Services',
    link: 'https://wa.me/+919000398800?text=CCTV%20Related%20Services',
    order: 3
  },
  {
    id: 4,
    title: 'Computer Related Services',
    description: 'Computer Software and Hardware Resolving',
    link: 'https://wa.me/+919000398800?text=Computer%20Software%20and%20Hardware%20Resolving',
    order: 4
  }
];

let cachedServices = [...defaultServices];

export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase.from('services').select('*').order('order');
  if (error) {
    console.error('Error fetching data:', error.message || error);
    return cachedServices;
  }
  
  if (data && data.length > 0) {
    cachedServices = data as Service[];
  }
  return cachedServices;
};

export const saveServices = async (services: Service[]): Promise<void> => {
  const { error } = await supabase.from('services').upsert(services, { onConflict: 'id' });
  if (error) {
    console.error('Error in write:', error.message || error);
    throw new Error(error.message || 'Write error');
  }
  cachedServices = [...services];
};

export const deleteService = async (id: number): Promise<void> => {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) {
    console.error('Error in write:', error.message || error);
    throw new Error(error.message || 'Write error');
  }
  cachedServices = cachedServices.filter(s => s.id !== id);
};
