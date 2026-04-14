export type Contact = {
  id: number;
  name: string;
  designation: string;
  email: string;
  phone: string;
  imageUrl: string;
  order: number;
};

export const defaultContacts: Contact[] = [
  {
    id: 1,
    name: 'Dande Vijaya Kumar',
    designation: 'Teacher | Thummalacheruvu',
    email: 'vkdande@gmail.com',
    phone: '+91 9849036590',
    imageUrl: 'https://lh3.googleusercontent.com/a-/ALV-UjXrKpshczpnB8_j7cuv9eMBI7SmYrJC1jWdzuZ5jPs2gjwgpkwo=s80-p-k-rw-no',
    order: 1
  },
  {
    id: 2,
    name: 'Dande Joseph Kumar',
    designation: 'Software & Hardware Services',
    email: 'joed4u@gmail.com',
    phone: '+91 9000398800',
    imageUrl: 'https://i0.wp.com/thebethania.org/uploads/7b11d12017a6d9f8f54cba3ba65b3adc.JPG?w=1200&ssl=1',
    order: 2
  }
];

export const getContacts = (): Contact[] => {
  if (typeof window === 'undefined') return defaultContacts;
  const stored = localStorage.getItem('contact_details');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse contacts from localStorage', e);
    }
  }
  return defaultContacts;
};

export const saveContacts = (contacts: Contact[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('contact_details', JSON.stringify(contacts));
  }
};
