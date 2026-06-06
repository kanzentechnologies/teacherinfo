'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, ArrowLeft, ArrowRight, ExternalLink, Loader2, AlertCircle, ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

function processUrlForEmbed(rawUrl: string): string {
  if (!rawUrl) return '';
  
  let url = rawUrl;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    const urlObj = new URL(url);
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else if (url.includes('/watch')) {
        videoId = urlObj.searchParams.get('v') || '';
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Google Drive
    if (urlObj.hostname.includes('drive.google.com') && url.includes('/view')) {
      return url.replace('/view', '/preview');
    }

    // Google Docs/Sheets
    if (urlObj.hostname.includes('docs.google.com') && url.includes('/edit')) {
      return url.replace(/\/edit.*$/, '/preview');
    }
    
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com') && !url.includes('player.vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }

    return url;
  } catch (e) {
    return url;
  }
}

export function EmbedIframe({ url, title }: { url: string, title?: string }) {
  const processedUrl = processUrlForEmbed(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameKey, setFrameKey] = useState(0);
  const [refreshTimestamp, setRefreshTimestamp] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevProcessedUrl, setPrevProcessedUrl] = useState(processedUrl);
  const [prevFrameKey, setPrevFrameKey] = useState(frameKey);

  const [showHint, setShowHint] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [customZoom, setCustomZoom] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);

  // Check if URL is known to block iframes
  const isKnownBlocked = React.useMemo(() => {
    try {
      const u = new URL(processedUrl);
      const blocked = ['github.com', 'twitter.com', 'x.com', 'linkedin.com', 'facebook.com', 'instagram.com', 'stackoverflow.com', 'medium.com', 'reddit.com'];
      return blocked.some(domain => u.hostname === domain || u.hostname.endsWith('.' + domain));
    } catch {
      return false;
    }
  }, [processedUrl]);

  if (processedUrl !== prevProcessedUrl || frameKey !== prevFrameKey) {
    setPrevProcessedUrl(processedUrl);
    setPrevFrameKey(frameKey);
    setIsLoading(true);
    setShowHint(false);
  }

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Some sites might block loading and not trigger onLoad quickly, or at all
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
      setShowHint(true);
    }, 4000);

    return () => clearTimeout(fallbackTimer);
  }, [processedUrl, frameKey]);

  const handleReload = () => {
    setFrameKey(prev => prev + 1);
    setRefreshTimestamp(Date.now());
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

  const zoomIn = () => setCustomZoom(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setCustomZoom(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setCustomZoom(1);

  const DESKTOP_WIDTH = 1280;
  const responsiveScale = containerWidth && containerWidth < DESKTOP_WIDTH ? containerWidth / DESKTOP_WIDTH : 1;
  const finalScale = responsiveScale * customZoom;

  const getDisplayUrl = () => {
    if (frameKey === 0 || !refreshTimestamp) return processedUrl;
    try {
      const u = new URL(processedUrl);
      // Avoid adding cache busters to known platforms that might break
      if (!u.hostname.includes('youtube.com') && 
          !u.hostname.includes('vimeo.com') && 
          !u.hostname.includes('drive.google.com') && 
          !u.hostname.includes('docs.google.com')) {
         u.searchParams.set('_refresh_cb', `${refreshTimestamp}_${frameKey}`);
      }
      return u.toString();
    } catch (e) {
      return processedUrl;
    }
  };

  const activeSrc = getDisplayUrl();

  return (
    <div 
      className={`mt-4 border border-border-main bg-gray-50 rounded-sm shadow-sm flex flex-col transition-all duration-300 ${isMinimized ? 'h-auto min-h-0' : 'h-[75vh] min-h-[500px]'}`}
      id="embed-iframe-container"
    >
      {/* Browser Bar */}
      <div className="bg-[#f0f0f0] border-b border-border-main px-3 py-2 flex items-center justify-between text-text-main rounded-t-sm shadow-sm z-10 w-full relative">
        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            id="iframe-back-btn"
            onClick={handleBack} 
            className="p-1.5 hover:bg-gray-300 rounded transition-colors text-gray-700" 
            title="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            id="iframe-forward-btn"
            onClick={handleForward} 
            className="p-1.5 hover:bg-gray-300 rounded transition-colors text-gray-700" 
            title="Go Forward"
          >
            <ArrowRight size={16} />
          </button>
          <button 
            id="iframe-reload-btn"
            onClick={handleReload} 
            className="p-1.5 hover:bg-gray-300 rounded transition-colors text-gray-700" 
            title="Reload Frame"
          >
            <RefreshCw size={16} />
          </button>
          
          <div className="h-6 w-[1px] bg-gray-300 mx-1" />
          
          <button 
            id="iframe-zoom-out-btn"
            onClick={zoomOut} 
            className="p-1.5 hover:bg-gray-300 rounded transition-colors text-gray-700" 
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-[10px] font-mono text-gray-500 w-8 text-center">{Math.round(customZoom * 100)}%</span>
          <button 
            id="iframe-zoom-in-btn"
            onClick={zoomIn} 
            className="p-1.5 hover:bg-gray-300 rounded transition-colors text-gray-700" 
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button 
            id="iframe-zoom-reset-btn"
            onClick={resetZoom} 
            className="p-1.5 hover:bg-gray-300 rounded transition-colors text-gray-700" 
            title="Reset Zoom"
          >
            <RotateCcw size={14} />
          </button>
        </div>
        
        <div className="flex-1 mx-4 max-w-xl hidden sm:flex items-center justify-center">
            <div className="w-full bg-white px-3 py-1 flex items-center text-xs text-gray-600 rounded-md border border-gray-300 truncate shadow-inner">
            {url}
            </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            id="iframe-minimize-toggle"
            onClick={() => setIsMinimized(!isMinimized)} 
            className="p-1.5 hover:bg-gray-300 rounded transition-colors text-gray-700" 
            title={isMinimized ? "Show Content" : "Hide Content"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          
          <a 
            id="iframe-external-link"
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-1.5 flex items-center gap-1 hover:bg-gray-300 rounded transition-colors text-gray-700 text-xs font-bold" 
            title="Open in New Tab"
          >
            <span>Open</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
      {/* Frame Container */}
      {!isMinimized && (
        <div className="flex-1 w-full bg-white relative overflow-hidden rounded-b-sm" ref={containerRef}>
        {isLoading && !isKnownBlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-0 text-text-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <span className="text-sm font-medium">Loading content...</span>
          </div>
        )}
        
        {isKnownBlocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-20 text-text-main p-6 text-center border-t border-border-main">
            <AlertCircle className="h-10 w-10 text-orange-500 mb-3" />
            <h3 className="text-lg font-bold mb-2">Embedding Restricted</h3>
            <p className="text-sm text-text-muted max-w-md mb-4 mt-2">
              This website ({new URL(processedUrl).hostname}) blocks other websites from embedding its content for security reasons.
            </p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-2 bg-primary text-white text-sm font-bold rounded shadow-sm hover:opacity-90 flex items-center gap-2"
            >
              Open Link in New Tab <ExternalLink size={16} />
            </a>
          </div>
        ) : (
          <iframe
            key={`${processedUrl}-${frameKey}`}
            ref={iframeRef}
            src={activeSrc}
            title={title || "Embedded Content"}
            className={`border-0 absolute top-0 left-0 z-10 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{
              width: finalScale < 1 ? `${DESKTOP_WIDTH / customZoom}px` : '100%',
              height: finalScale < 1 ? `${(100 / finalScale)}%` : '100%',
              transform: `scale(${finalScale})`,
              transformOrigin: '0 0'
            }}
            allowFullScreen
            referrerPolicy="no-referrer"
            onLoad={() => {
              setIsLoading(false);
              setShowHint(true);
            }}
          />
        )}

        {showHint && !isKnownBlocked && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-gray-800 text-white text-xs px-3 py-2 rounded-full shadow-lg opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity duration-300">
             <AlertCircle size={14} />
             <span>Blank? Some websites block embedding.</span>
             <a href={url} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-300 hover:text-blue-200 underline font-semibold">
               Open in new tab
             </a>
             <button onClick={() => setShowHint(false)} className="ml-2 hover:text-gray-300">&times;</button>
          </div>
        )}
      </div>
    )}
  </div>
  );
}
