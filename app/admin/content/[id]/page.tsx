import React from 'react';
import EditContentClient from './EditContentClient';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditContentClient params={params} />;
}
