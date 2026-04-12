import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <li><Link href="/category/updates" className="hover:text-accent hover:underline">Latest Updates</Link></li>
            <li><Link href="/category/jobs" className="hover:text-accent hover:underline">Job Notifications</Link></li>
            <li><Link href="/category/results" className="hover:text-accent hover:underline">Results</Link></li>
            <li><Link href="/about" className="hover:text-accent hover:underline">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-white/20 pb-2">Resources</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/category/study-materials" className="hover:text-accent hover:underline">Study Materials</Link></li>
            <li><Link href="/category/previous-papers" className="hover:text-accent hover:underline">Previous Papers</Link></li>
            <li><Link href="/category/downloads" className="hover:text-accent hover:underline">Downloads & Forms</Link></li>
            <li><Link href="/sitemap" className="hover:text-accent hover:underline">Sitemap</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-white/20 pb-2">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Email: support@teacherinfo.net</li>
            <li>Helpline: 1800-XXX-XXXX</li>
            <li>Working Hours: 10:00 AM to 6:00 PM (Mon-Sat)</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-[#002244] py-4 px-4 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Teacher Info Portal. All rights reserved.</p>
        <p className="mt-1">Disclaimer: This is an informational website. We do not claim to be an official government portal.</p>
      </div>
    </footer>
  );
}
