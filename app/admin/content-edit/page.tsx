import React, { Suspense } from 'react';
import EditContentClient from './EditContentClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditContentClient />
    </Suspense>
  );
}
