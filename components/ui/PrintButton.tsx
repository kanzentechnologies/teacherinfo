'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1.5 rounded text-text-main hover:bg-gray-200 transition-colors cursor-pointer"
    >
      <Printer size={16} /> Print
    </button>
  );
}
