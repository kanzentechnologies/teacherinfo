'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdPlaceholder } from './AdPlaceholder';

interface ClientSideAdProps {
  format: 'leaderboard' | 'rectangle' | 'skyscraper' | 'fluid';
  className?: string;
  wrapperClassName?: string;
}

export function ClientSideAd({ format, className, wrapperClassName = '' }: ClientSideAdProps) {
  const pathname = usePathname();
  
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      <AdPlaceholder format={format} className={className} />
    </div>
  );
}
