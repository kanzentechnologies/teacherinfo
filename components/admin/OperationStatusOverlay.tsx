import React from 'react';
import { Loader2 } from 'lucide-react';

interface OperationStatusOverlayProps {
  status: string | null;
  details?: string | null;
  progress?: number | null; // 0 to 100
}

export function OperationStatusOverlay({ status, details, progress }: OperationStatusOverlayProps) {
  if (!status) return null;

  return (
    <>
      <style>{`
        .os-overlay-backdrop {
          position: absolute;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          min-height: 200px;
          border-radius: 8px;
        }
        .os-overlay-dialog {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 320px;
          box-sizing: border-box;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          margin: 0 16px;
        }
        .os-overlay-icon {
          animation: os-spin 1.2s linear infinite;
          color: #007aff;
          margin-bottom: 16px;
        }
        .os-overlay-title {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
          text-align: center;
          margin: 0 0 6px 0;
        }
        .os-overlay-details {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 13px;
          color: #86868b;
          text-align: center;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }
        .os-overlay-progress-track {
          width: 100%;
          height: 6px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          overflow: hidden;
        }
        .os-overlay-progress-fill {
          height: 100%;
          background: #007aff;
          transition: width 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .os-overlay-percentage {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 12px;
          color: #86868b;
          font-weight: 500;
          text-align: center;
          margin-top: 8px;
        }
        @keyframes os-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="os-overlay-backdrop">
        <div className="os-overlay-dialog">
          <Loader2 size={36} className="os-overlay-icon" />
          <div className="os-overlay-title">{status}</div>
          
          {details && (
            <div className="os-overlay-details">{details}</div>
          )}
          
          {progress !== undefined && progress !== null && (
            <div style={{ width: '100%', marginTop: !details ? '12px' : '0' }}>
              <div className="os-overlay-progress-track">
                <div 
                  className="os-overlay-progress-fill"
                  style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                />
              </div>
              <div className="os-overlay-percentage">
                {Math.round(progress)}%
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
