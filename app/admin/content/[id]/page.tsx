import React from 'react';
import EditContentClient from './EditContentClient';
import { getPages } from '@/lib/pageStore';

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map((page) => ({
    id: page.id.toString(),
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditContentClient params={params} />;
}
