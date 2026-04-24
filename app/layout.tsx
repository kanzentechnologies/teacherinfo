import type {Metadata} from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://teacherinfo.net'),
  title: {
    default: 'Teacher Info Portal - Educational Resources & Updates',
    template: '%s | Teacher Info Portal',
  },
  description: 'Comprehensive educational resources, study materials, previous papers, job notifications, and latest updates for teaching professionals and aspirants.',
  keywords: ['teacher info', 'study materials', 'previous papers', 'AP DSC', 'TET', 'SSC', 'teaching jobs', 'education portal', 'teacher resources'],
  authors: [{ name: 'Teacher Info Portal Admin' }],
  creator: 'Teacher Info Portal',
  publisher: 'Teacher Info Portal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Teacher Info Portal - Educational Resources & Updates',
    description: 'Comprehensive educational resources, study materials, previous papers, job notifications, and latest updates for teaching professionals and aspirants.',
    url: '/',
    siteName: 'Teacher Info Portal',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teacher Info Portal - Educational Resources & Updates',
    description: 'Comprehensive educational resources, study materials, previous papers, job notifications, and latest updates for teaching professionals and aspirants.',
  },
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/studio-6624311534-29f23.firebasestorage.app/o/logo.png?alt=media&token=79cb88ef-c95b-4959-a8f3-79da6a33f3c4',
    apple: 'https://firebasestorage.googleapis.com/v0/b/studio-6624311534-29f23.firebasestorage.app/o/logo.png?alt=media&token=79cb88ef-c95b-4959-a8f3-79da6a33f3c4',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <Header />
        <Navigation />
        <main id="main-content" className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-8 py-6">
          <div className="mb-6">
            <AdPlaceholder format="leaderboard" />
          </div>
          {children}
          <div className="mt-8">
            <AdPlaceholder format="leaderboard" />
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
