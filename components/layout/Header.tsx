import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-white border-b border-border-main py-4 px-4 sm:px-8 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image 
            src="https://firebasestorage.googleapis.com/v0/b/studio-6624311534-29f23.firebasestorage.app/o/logo.png?alt=media&token=79cb88ef-c95b-4959-a8f3-79da6a33f3c4" 
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
        <div className="text-right">
          <div className="text-sm font-bold text-text-main">Helpline Number</div>
          <div className="text-lg text-primary font-bold">1800-XXX-XXXX</div>
        </div>
      </div>
    </header>
  );
}
