import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Download, Calendar } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${title} Resources`,
    description: `Browse the latest ${title.toLowerCase()} resources, study materials, and updates for teachers and aspirants.`,
    openGraph: {
      title: `${title} Resources | Teacher Info Portal`,
      description: `Browse the latest ${title.toLowerCase()} resources, study materials, and updates for teachers and aspirants.`,
      url: `/category/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const categories = [
    'useful-links', 'income-tax', 'gos-and-proceedings', 
    'softwares', 'forms', 'academics', 'services',
    'updates', 'study-materials', 'previous-papers', 'jobs', 'results', 'downloads'
  ];
  return categories.map((slug) => ({
    slug: slug,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Format slug to title
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Mock data
  const items = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    title: `${title} - Important Document ${i + 1}`,
    date: `1${i} Apr 2024`,
    type: i % 3 === 0 ? 'PDF' : 'Article',
    size: i % 3 === 0 ? '2.4 MB' : null,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-main p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-primary mb-2 border-b border-border-main pb-4">{title}</h1>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 border border-border-main">
            <span className="text-sm font-bold text-text-main">Showing {items.length} results</span>
            <div className="flex gap-2 items-center">
              <label htmlFor="sort" className="text-sm text-text-muted">Sort by:</label>
              <select id="sort" className="text-sm border border-border-main p-1 bg-white">
                <option>Latest First</option>
                <option>Oldest First</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border-main text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="border border-border-main p-3 text-left w-16">S.No</th>
                  <th className="border border-border-main p-3 text-left">Title / Description</th>
                  <th className="border border-border-main p-3 text-left w-32">Date</th>
                  <th className="border border-border-main p-3 text-center w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-hover-bg even:bg-gray-50">
                    <td className="border border-border-main p-3 text-center">{index + 1}</td>
                    <td className="border border-border-main p-3">
                      <div className="flex items-start gap-2">
                        <FileText size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                        <div>
                          <Link href={`/content/${item.id}`} className="font-medium text-secondary hover:underline">
                            {item.title}
                          </Link>
                          {item.type === 'PDF' && (
                            <span className="ml-2 inline-block bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5 rounded-sm border border-red-200">
                              PDF {item.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="border border-border-main p-3 text-text-muted">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {item.date}
                      </div>
                    </td>
                    <td className="border border-border-main p-3 text-center">
                      {item.type === 'PDF' ? (
                        <button className="inline-flex items-center gap-1 bg-secondary text-white px-3 py-1.5 text-xs rounded-sm hover:bg-primary transition-colors">
                          <Download size={14} /> Download
                        </button>
                      ) : (
                        <Link href={`/content/${item.id}`} className="inline-flex items-center gap-1 bg-gray-200 text-text-main px-3 py-1.5 text-xs rounded-sm hover:bg-gray-300 transition-colors">
                          View Details
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-border-main bg-gray-100 text-text-muted cursor-not-allowed">Previous</button>
              <button className="px-3 py-1 border border-primary bg-primary text-white">1</button>
              <button className="px-3 py-1 border border-border-main hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-border-main hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border border-border-main hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
