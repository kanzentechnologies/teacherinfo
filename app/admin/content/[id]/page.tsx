import React from 'react';
import EditContentClient from './EditContentClient';
import { getPages } from '@/lib/pageStore';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const items = await getPages();
    if (!items || items.length === 0) {
      return [{ id: 'fallback-id' }];
    }
    return items.map((item) => ({
      id: item.id,
    }));
  } catch (e) {
    console.error('Error generating static params for admin content:', e);
    return [{ id: 'error-id' }];
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditContentClient params={params} />;
}
