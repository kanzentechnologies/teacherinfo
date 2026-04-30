'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, ArrowLeft, ArrowRight, ExternalLink, Loader2 } from 'lucide-react';

export function EmbedIframe({ url, title }: { url: string, title?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameKey, setFrameKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [url, frameKey]);

  const handleReload = () => {
    setFrameKey(prev => prev + 1);
  };


  const handleBack = () => {
    try {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.history.back();
      }
    } catch (e) {
      console.warn("Cross-origin frame navigation blocked.");
      alert("Browser security prevents backward navigation for external websites.");
    }
  };

  const handleForward = () => {
    try {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.history.forward();
      }
    } catch (e) {
      console.warn("Cross-origin frame navigation blocked.");
      alert("Browser security prevents forward navigation for external websites.");
    }
  };

  return (
    <div className="mt-8 border border-border-main bg-gray-50 rounded-sm shadow-sm overflow-hidden flex flex-col h-[75vh] min-h-[500px]">
      {/* Browser Bar */}
      <div className="bg-[#f0f0f0] border-b border-border-main px-3 py-2 flex items-center justify-between text-text-main shadow-sm z-10 w-full relative">
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={handleBack} className="p-1.5 hover:bg-gray-300 rounded transition-colors text-gray-700" title="Go Back (May be blocked by browser)">
            <ArrowLeft size={16} />
          </button>
          <button onClick={handleForward} className="p-1.5 hover:bg-gray-300 rounded transition-colors text-gray-700" title="Go Forward (May be blocked by browser)">
            <ArrowRight size={16} />
          </button>
          <button onClick={handleReload} className="p-1.5 hover:bg-gray-300 rounded transition-colors text-gray-700" title="Reload Frame">
            <RefreshCw size={16} />
          </button>
        </div>
        
        <div className="flex-1 mx-4 max-w-xl hidden sm:flex items-center justify-center">
            <div className="w-full bg-white px-3 py-1 flex items-center text-xs text-gray-600 rounded-md border border-gray-300 truncate shadow-inner">
            {url}
            </div>
        </div>

        <div className="shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer" className="p-1.5 flex items-center gap-1 hover:bg-gray-300 rounded transition-colors text-gray-700 text-xs font-bold" title="Open in New Tab">
            <span>Open</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
      {/* Frame Container */}
      <div className="flex-1 w-full bg-white relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-0 text-text-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <span className="text-sm font-medium">Loading content...</span>
          </div>
        )}
        <iframe
          key={frameKey}
          ref={iframeRef}
          src={url}
          title={title || "Embedded Content"}
          className={`w-full h-full border-0 absolute inset-0 z-10 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
