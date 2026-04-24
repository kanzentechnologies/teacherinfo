import React from 'react';

type AdFormat = 'leaderboard' | 'rectangle' | 'skyscraper' | 'fluid';

interface AdPlaceholderProps {
  format?: AdFormat;
  className?: string;
  label?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ 
  format = 'leaderboard', 
  className = '',
  label = 'Advertisement'
}) => {
  // Define format-specific dimensions and styles
  const formatStyles = {
    leaderboard: 'w-full max-w-[728px] h-[90px] mx-auto', // Typical desktop leaderboard, scales down roughly on mobile
    rectangle: 'w-[300px] h-[250px] mx-auto', // Medium rectangle, fits easily in sidebars
    skyscraper: 'w-[160px] h-[600px] mx-auto', // Wide skyscraper
    fluid: 'w-full min-h-[100px]', // Responsive/native in-feed
  };

  return (
    <div 
      className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative rounded-md ${formatStyles[format]} ${className}`}
      aria-label="Advertisement placeholder"
    >
      <div className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-widest text-center px-4">
        {label}
        {format !== 'fluid' && <div className="text-[10px] opacity-70 mt-1 capitalize">{format}</div>}
      </div>
    </div>
  );
};
