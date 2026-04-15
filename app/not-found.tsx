import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-4xl font-bold text-primary mb-4">404 - Page Not Found</h2>
      <p className="text-text-muted mb-8">The page you are looking for does not exist or has been moved.</p>
      <Link 
        href="/" 
        className="bg-primary text-white px-6 py-2 rounded-sm hover:bg-secondary transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
