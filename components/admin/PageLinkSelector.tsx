'use client';

import React, { useState, useEffect } from 'react';
import { getPages, PageItem } from '@/lib/pageStore';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';

interface PageLinkSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function PageLinkSelector({ value, onChange, label = "Destination" }: PageLinkSelectorProps) {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [mode, setMode] = useState<'internal' | 'external'>(
    value.startsWith('http') || value.startsWith('www') || value === '' ? 'external' : 'internal'
  );

  useEffect(() => {
    const fetchPages = async () => {
      const allItems = await getPages();
      setPages(allItems);
    };
    fetchPages();
  }, []);

  // Update mode if value changes externally (e.g. when editing)
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value && !value.startsWith('http') && !value.startsWith('www') && value.startsWith('/')) {
      setMode('internal');
    } else if (value.startsWith('http') || value.startsWith('www')) {
      setMode('external');
    }
  }

  const handleInternalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleExternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-primary">{label}</label>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => {
            setMode('internal');
            if (pages.length > 0) onChange(`/${pages[0].slug}`);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold border ${
            mode === 'internal' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-text-muted border-border-main hover:bg-gray-50'
          }`}
        >
          <LinkIcon size={14} />
          Internal Page
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('external');
            // Don't clear value if it was already external
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold border ${
            mode === 'external' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-text-muted border-border-main hover:bg-gray-50'
          }`}
        >
          <ExternalLink size={14} />
          External URL
        </button>
      </div>

      {mode === 'internal' ? (
        <select
          className="w-full border border-border-main p-2 text-sm bg-white"
          value={value.startsWith('/') ? value : ''}
          onChange={handleInternalChange}
        >
          <option value="" disabled>Select a page...</option>
          {pages.map(page => (
            <option key={page.id} value={`/${page.slug}`}>
              {page.title} (/{page.slug})
            </option>
          ))}
          {pages.length === 0 && <option disabled>No pages found. Create one first!</option>}
        </select>
      ) : (
        <input
          type="text"
          className="w-full border border-border-main p-2 text-sm"
          placeholder="https://example.com"
          value={value}
          onChange={handleExternalChange}
        />
      )}
      <p className="text-[10px] text-text-muted italic">
        Current destination: <span className="text-secondary font-mono">{value || 'None'}</span>
      </p>
    </div>
  );
}
