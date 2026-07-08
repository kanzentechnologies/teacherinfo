import React from 'react';
import { Loader2 } from 'lucide-react';

interface OperationStatusOverlayProps {
  status: string | null;
  progress?: number | null; // 0 to 100
  details?: string | null;
}

export function OperationStatusOverlay({ status, progress, details }: OperationStatusOverlayProps) {
  if (!status) return null;

  return (
    <div className="absolute inset-0 bg-white/70 z-50 flex flex-col items-center justify-center backdrop-blur-[2px] rounded-md transition-all">
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl border border-gray-100 flex flex-col w-full max-w-sm mx-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-2.5 bg-blue-50 rounded-full text-blue-600 shrink-0">
            <Loader2 size={22} className="animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-gray-900 truncate" title={status}>{status}</h3>
            {details && <p className="text-xs text-gray-500 mt-0.5 truncate" title={details}>{details}</p>}
          </div>
        </div>
        
        {progress !== undefined && progress !== null && (
          <div className="w-full mt-3">
            <div className="flex justify-between items-center mb-1.5 px-1">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Progress</span>
              <span className="text-xs font-semibold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
