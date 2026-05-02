import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-white/20 pb-2">About Us</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Teacher Info Portal is a dedicated platform providing the latest updates, study materials, and job notifications for teaching professionals and aspirants.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-white/20 pb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/" className="hover:text-accent hover:underline">Home</Link></li>
            <li><Link href="/category/useful-links" className="hover:text-accent hover:underline">Useful Links</Link></li>
            <li><Link href="/category/income-tax" className="hover:text-accent hover:underline">Income Tax</Link></li>
            <li><Link href="/category/gos-and-proceedings" className="hover:text-accent hover:underline">GO’s & Proceedings</Link></li>
            <li><Link href="/about" className="hover:text-accent hover:underline">About Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="bg-[#002244] py-4 px-4 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Teacher Info Portal. All rights reserved. | <Link href="/admin" className="hover:text-white hover:underline">Admin Login</Link></p>
        <p className="mt-1">Disclaimer: This is an informational website. We do not claim to be an official government portal.</p>
        <p className="mt-1">Designed and Developed by <a href="https://amcny.github.io/kanzen_technologies/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">Kanzen Technologies Private Limited</a>.</p>
      </div>
    </footer>
  );
}
