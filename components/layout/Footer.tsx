import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="bg-[#002244] py-4 px-4 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Teacher Info Portal. All rights reserved. | <Link href="/admin" className="hover:text-white hover:underline">Admin Login</Link></p>
        <p className="mt-1">Disclaimer: This is an informational website. We do not claim to be an official government portal.</p>
        <p className="mt-1">Designed and Developed by <a href="https://amcny.github.io/kanzen_technologies/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">Kanzen Technologies Private Limited</a>.</p>
      </div>
    </footer>
  );
}
