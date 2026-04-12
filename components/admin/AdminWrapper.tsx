import React from 'react';
import { AdminNav } from './AdminNav';

export function AdminWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full">
      <AdminNav />
      <div className="flex-1 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
