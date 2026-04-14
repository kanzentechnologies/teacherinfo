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

export const getServices = (): Service[] => {
  if (typeof window === 'undefined') return defaultServices;
  const stored = localStorage.getItem('site_services');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse services from localStorage', e);
    }
  }
  return defaultServices;
};

export const saveServices = (services: Service[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('site_services', JSON.stringify(services));
  }
};
