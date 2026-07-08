import React from 'react';
import { Loader2 } from 'lucide-react';

interface OperationStatusOverlayProps {
  status: string | null;
  progress?: number | null; // 0 to 100
}

export function OperationStatusOverlay({ status, progress }: OperationStatusOverlayProps) {
  if (!status) return null;

  return (
    <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm min-h-[200px] rounded-md">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-border-main flex flex-col items-center max-w-sm w-full mx-4">
        <Loader2 size={40} className="animate-spin text-primary mb-4" />
        <div className="text-lg font-bold text-primary text-center mb-2">{status}</div>
        
        {progress !== undefined && progress !== null && (
          <div className="w-full mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
            <div className="text-xs text-text-muted text-center mt-2 font-medium">
              {Math.round(progress)}% Complete
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
