'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-4xl font-bold text-primary mb-4">Something went wrong!</h2>
      <p className="text-text-muted mb-8">An unexpected error occurred.</p>
      <button
        onClick={() => reset()}
        className="bg-primary text-white px-6 py-2 rounded-sm hover:bg-secondary transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
