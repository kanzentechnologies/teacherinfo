import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-white border-b border-border-main py-4 px-4 sm:px-8 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image 
            src="https://pub-394d485f92444007bc7c08718b11be20.r2.dev/logo.png" 
            alt="Teacher Info Portal Logo" 
            width={64} 
            height={64} 
            className="rounded-sm object-contain"
            referrerPolicy="no-referrer"
          />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary leading-tight">Teacher Info Portal</h1>
          <p className="text-sm text-text-muted">Comprehensive Educational Resources & Updates</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4">
      </div>
    </header>
  );
}
