import type {Metadata} from 'next';
import { Noto_Sans } from 'next/font/google';
import Script from 'next/script';
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
  metadataBase: new URL(process.env.APP_URL || 'https://www.teacherinfo.net'),
  title: {
    default: 'Teacher Info Portal - Educational Resources & Updates',
    template: '%s | Teacher Info Portal',
  },
  description: 'Most trusted portal for AP Teachers, TS Teachers, PRC, DA, ZPF, AP GLI, CPS, NPS, Exam Results, Study Materials, DSC & TET notifications. Similar to apteachers, gsrmaths.',
  keywords: ['apteachers', 'manabadi', 'gsrmaths', 'AP Teachers', 'TS Teachers', 'Education Updates', 'Exams', 'Results', 'PRC', 'DA', 'ZPF', 'AP GLI', 'CPS', 'NPS', 'AP Govt Employees', 'TS Govt Employees', 'AP DSC', 'TS TET', 'TRT notifications', 'study materials', 'educational resources', 'teacher portal', 'education', 'previous papers', 'teaching jobs', 'Sakshi Education', 'Eenadu Pratibha'],
  authors: [{ name: 'Teacher Info Portal Admin' }],
  creator: 'Teacher Info Portal Admin',
  publisher: 'Teacher Info Portal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Teacher Info Portal - AP Teachers & Education Updates',
    description: 'Get the latest AP/TS Teachers updates, PRC, DA, Employees news, DA, DSC/TET notifications, and study materials.',
    url: '/',
    siteName: 'Teacher Info Portal',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/studio-6624311534-29f23.firebasestorage.app/o/logo.png?alt=media&token=79cb88ef-c95b-4959-a8f3-79da6a33f3c4',
        width: 1200,
        height: 630,
        alt: 'Teacher Info Portal',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teacher Info Portal - AP/TS Teachers & Education Updates',
    description: 'Latest AP/TS Teachers updates, Manabadi results, PRC, Employees news, DSC/TET notifications, and study materials.',
    images: ['https://firebasestorage.googleapis.com/v0/b/studio-6624311534-29f23.firebasestorage.app/o/logo.png?alt=media&token=79cb88ef-c95b-4959-a8f3-79da6a33f3c4'],
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
  other: {
    'google-adsense-account': 'ca-pub-5843738252123218',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Teacher Info Portal',
    url: 'https://www.teacherinfo.net',
    description: 'Most trusted portal for AP Teachers, TS Teachers, employees news, exams, results, and study materials.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.teacherinfo.net/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en" className={notoSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5843738252123218"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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
