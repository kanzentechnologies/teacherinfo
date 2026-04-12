import type {Metadata} from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Teacher Info Website',
  description: 'Educational information website for teachers.',
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/studio-6624311534-29f23.firebasestorage.app/o/logo.png?alt=media&token=79cb88ef-c95b-4959-a8f3-79da6a33f3c4',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <Header />
        <Navigation />
        <main id="main-content" className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
