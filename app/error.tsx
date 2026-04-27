'use client';
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-4xl font-bold text-primary mb-4">Something went wrong</h2>
      <button onClick={() => reset()} className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-opacity-90">
        Try again
      </button>
    </div>
  );
}
