import Link from 'next/link';

export function HeroBanner() {
  return (
    <div className="bg-primary text-white p-6 md:p-10 rounded-sm relative overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Empowering Teachers with Quality Resources</h2>
        <p className="text-sm md:text-base text-gray-200 mb-6 leading-relaxed">
          Access the latest study materials, previous question papers, and job notifications. 
          A dedicated portal for teaching professionals and aspirants to stay updated and prepared.
        </p>
        <Link href="/category/academics" className="inline-block bg-accent text-primary font-bold py-2 px-6 rounded-sm hover:bg-yellow-400 transition-colors">
          Explore Materials
        </Link>
      </div>
      {/* Decorative background element */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-secondary/50 transform skew-x-12 translate-x-10"></div>
    </div>
  );
}
