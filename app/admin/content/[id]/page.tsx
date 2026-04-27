import React from 'react';
import EditContentClient from './EditContentClient';
import { getNavItems } from '@/lib/navStore';

export async function generateStaticParams() {
  try {
    const items = await getNavItems();
    return items.map((item) => ({
      id: item.id,
    }));
  } catch (e) {
    console.error('Error generating static params for admin content:', e);
    return [];
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditContentClient params={params} />;
}
