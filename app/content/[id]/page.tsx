import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Tag, Download, Share2, Printer } from 'lucide-react';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  // In a real app, you would fetch the content data here based on the ID
  const title = `Mathematics Class 10 Important Questions & Chapter-wise Notes 2024`;
  const description = `Comprehensive guide for Class 10 Mathematics. Chapter-wise notes and important questions for revision.`;
  
  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | Teacher Info Portal`,
      description: description,
      url: `/content/${id}`,
      type: 'article',
      publishedTime: '2024-04-12T00:00:00.000Z',
      authors: ['Admin'],
      tags: ['Mathematics', 'Class 10', 'Study Materials'],
    },
  };
}

export async function generateStaticParams() {
  // Generate some mock IDs for static export
  return Array.from({ length: 10 }).map((_, i) => ({
    id: i.toString(),
  }));
}

export default async function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-3/4 flex flex-col gap-6">
        <div className="bg-white border border-border-main p-6">
          <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider self-start">
              Study Materials
            </span>
            <AdPlaceholder format="fluid" className="w-full md:w-[320px] h-[50px] !m-0" label="Sponsor" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">
            Mathematics Class 10 Important Questions & Chapter-wise Notes 2024
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted border-b border-border-main pb-4 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Published: 12 Apr 2024</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>By Admin</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag size={16} />
              <span>Mathematics, Class 10</span>
            </div>
          </div>

          <div className="prose max-w-none text-text-main text-sm md:text-base leading-relaxed">
            <p className="mb-4">
              Welcome to the comprehensive guide for Class 10 Mathematics. This material has been prepared according to the latest syllabus and guidelines provided by the educational board.
            </p>
            <p className="mb-4">
              Students preparing for their final examinations will find these chapter-wise notes and important questions highly beneficial for their revision.
            </p>
            
            <div className="my-6">
              <AdPlaceholder format="fluid" className="w-full h-[100px]" label="In-article Ad" />
            </div>

            <h3 className="text-lg font-bold text-primary mt-8 mb-4">Contents Covered:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Real Numbers and Polynomials</li>
              <li>Pair of Linear Equations in Two Variables</li>
              <li>Quadratic Equations</li>
              <li>Arithmetic Progressions</li>
              <li>Triangles and Coordinate Geometry</li>
              <li>Trigonometry and its Applications</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm my-8">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <Download size={18} /> Download PDF Materials
              </h4>
              <p className="text-sm text-blue-700 mb-4">
                Click the links below to download the PDF files for offline reading and printing.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white p-3 border border-blue-100">
                  <span className="font-medium text-sm">Chapter 1-5 Complete Notes.pdf (3.2 MB)</span>
                  <button className="bg-secondary text-white px-4 py-1.5 text-sm rounded-sm hover:bg-primary transition-colors">
                    Download
                  </button>
                </div>
                <div className="flex justify-between items-center bg-white p-3 border border-blue-100">
                  <span className="font-medium text-sm">Important Questions Bank 2024.pdf (1.8 MB)</span>
                  <button className="bg-secondary text-white px-4 py-1.5 text-sm rounded-sm hover:bg-primary transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border-main flex justify-between items-center">
            <div className="flex gap-2">
              <button className="flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors">
                <Share2 size={16} /> Share
              </button>
              <button className="flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors ml-4">
                <Printer size={16} /> Print
              </button>
            </div>
          </div>
        </div>
        <AdPlaceholder format="fluid" className="w-full h-[90px]" />
      </div>

      <div className="lg:w-1/4 flex flex-col gap-6">
        <div className="bg-white border border-border-main">
          <div className="bg-gray-100 border-b border-border-main px-4 py-3">
            <h3 className="font-bold text-primary">Related Content</h3>
          </div>
          <ul className="divide-y divide-border-main">
            {[1, 2, 3, 4].map((i) => (
              <li key={i}>
                <Link href={`/content/${i}`} className="block px-4 py-3 hover:bg-hover-bg transition-colors">
                  <div className="text-sm font-medium text-text-main hover:text-primary mb-1">
                    Science Class 10 Important Questions {i}
                  </div>
                  <div className="text-xs text-text-muted">
                    10 Apr 2024
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="sticky top-6">
          <AdPlaceholder format="skyscraper" className="hidden lg:flex" />
          <AdPlaceholder format="rectangle" className="flex lg:hidden" />
        </div>
      </div>
    </div>
  );
}
