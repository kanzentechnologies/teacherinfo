'use client';

import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  accept?: string;
}

export function FileUpload({ onUploadSuccess, label = 'Upload File', accept = 'image/*' }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setPreviewUrl(data.url);
      onUploadSuccess(data.url);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const clearUpload = () => {
    setPreviewUrl('');
    setError('');
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-primary mb-1">{label}</label>
      
      {!previewUrl && !isUploading && (
        <div className="relative border-2 border-dashed border-border-main p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
          <Upload className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 font-medium">Click or drag file to upload</p>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={accept}
            onChange={handleFileChange}
          />
        </div>
      )}

      {isUploading && (
        <div className="border border-border-main p-6 flex flex-col items-center justify-center bg-gray-50">
          <Loader2 className="animate-spin text-primary mb-2" />
          <p className="text-sm text-gray-500 font-medium">Uploading...</p>
        </div>
      )}

      {previewUrl && !isUploading && (
        <div className="relative border border-border-main p-2">
          {accept.includes('image') ? (
            <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="p-4 bg-gray-50 text-center text-sm font-medium text-primary">
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                View Uploaded File
              </a>
            </div>
          )}
          <button
            onClick={clearUpload}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm border border-border-main hover:bg-gray-100"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2 font-medium">{error}</p>
      )}
    </div>
  );
}
