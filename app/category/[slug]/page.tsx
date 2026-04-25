import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Download, Calendar, Link as LinkIcon } from 'lucide-react';
import { getPostsByCategory } from '@/lib/postStore';
import { getCategories } from '@/lib/categoryStore';

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
      images: [
        {
          url: 'https://firebasestorage.googleapis.com/v0/b/studio-6624311534-29f23.firebasestorage.app/o/logo.png?alt=media&token=79cb88ef-c95b-4959-a8f3-79da6a33f3c4',
          width: 1200,
          height: 630,
          alt: 'Teacher Info Portal',
        }
      ],
    },
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  
  // ensure we have at least these default slugs just in case
  const defaultSlugs = [
    'useful-links', 'income-tax', 'gos-and-proceedings', 
    'softwares', 'forms', 'academics', 'services',
    'updates', 'study-materials', 'previous-papers', 'jobs', 'results', 'downloads'
  ];
  
  const allSlugs = new Set([...categories.map(c => c.slug), ...defaultSlugs]);
  
  return Array.from(allSlugs).map((slug) => ({
    slug: slug,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Format slug to title
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const posts = await getPostsByCategory(slug);
  const publishedPosts = posts.filter(p => p.status === 'Published');

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-main p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-primary mb-2 border-b border-border-main pb-4">{title}</h1>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 border border-border-main">
            <span className="text-sm font-bold text-text-main">Showing {publishedPosts.length} results</span>
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
                {publishedPosts.map((item, index) => (
                  <tr key={item.id} className="hover:bg-hover-bg even:bg-gray-50">
                    <td className="border border-border-main p-3 text-center">{index + 1}</td>
                    <td className="border border-border-main p-3">
                      <div className="flex items-start gap-2">
                         {item.type === 'Link' ? (
                           <LinkIcon size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                         ) : (
                           <FileText size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                         )}
                        <div>
                          {item.type === 'Link' ? (
                            <a href={item.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="font-medium text-secondary hover:underline">
                              {item.title}
                            </a>
                          ) : (
                            <Link href={`/content/${item.id}`} className="font-medium text-secondary hover:underline">
                              {item.title}
                            </Link>
                          )}
                          {item.type === 'PDF' && (
                            <span className="ml-2 inline-block bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5 rounded-sm border border-red-200">
                              PDF {item.fileSize || 'Download'}
                            </span>
                          )}
                          {item.type === 'Link' && (
                            <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-sm border border-blue-200">
                              External Link
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
                      {item.type === 'PDF' && item.fileUrl ? (
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-secondary text-white px-3 py-1.5 text-xs rounded-sm hover:bg-primary transition-colors">
                          <Download size={14} /> Download
                        </a>
                      ) : item.type === 'Link' ? (
                        <a href={item.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 text-xs rounded-sm hover:bg-green-700 transition-colors">
                          Visit Link
                        </a>
                      ) : (
                        <Link href={`/content/${item.id}`} className="inline-flex items-center gap-1 bg-gray-200 text-text-main px-3 py-1.5 text-xs rounded-sm hover:bg-gray-300 transition-colors">
                          View Details
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
                
                {publishedPosts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="border border-border-main p-6 text-center text-text-muted">
                      No matching records found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
