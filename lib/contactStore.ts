import { supabase } from './supabase';

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

let cachedContacts = [...defaultContacts];

export const getContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase.from('contacts').select('*').order('order');
  if (error) {
    if (!error.message?.includes('schema cache') && !error.message?.includes('find the table')) {
      console.error('Error fetching data:', error.message || error);
    }
    return cachedContacts;
  }
  
  if (data) {
    cachedContacts = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      designation: row.designation,
      email: row.email,
      phone: row.phone,
      imageUrl: row.image_url,
      order: row.order
    })) as Contact[];
  }
  return cachedContacts;
};

export const saveContacts = async (contacts: Contact[]): Promise<void> => {
  const mapped = contacts.map(c => ({
    id: typeof c.id === 'string' ? parseInt(c.id, 10) : c.id,
    name: c.name,
    designation: c.designation,
    email: c.email,
    phone: c.phone,
    image_url: c.imageUrl,
    "order": c.order
  }));
  const { error } = await supabase.from('contacts').upsert(mapped, { onConflict: 'id' });
  if (error) {
    console.error('Error in write:', error.message || error);
    throw new Error(error.message || 'Write error');
  }
  cachedContacts = [...contacts];
};

export const deleteContact = async (id: number): Promise<void> => {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) {
    console.error('Error in write:', error.message || error);
    throw new Error(error.message || 'Write error');
  }
  cachedContacts = cachedContacts.filter(c => c.id !== id);
};
