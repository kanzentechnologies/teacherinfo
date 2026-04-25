import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Tag, Download, Share2, Printer } from 'lucide-react';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';
import { getPosts, Post } from '@/lib/postStore';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const posts = await getPosts();
  const post = posts.find((p: Post) => p.id === id);
  
  if (!post) {
    return {
      title: 'Post Not Found | Teacher Info Portal',
    }
  }
  
  return {
    title: post.title,
    description: post.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
    openGraph: {
      title: `${post.title} | Teacher Info Portal`,
      description: post.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
      url: `/content/${id}`,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p: Post) => ({
    id: p.id,
  }));
}

export default async function ContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const posts = await getPosts();
  const post = posts.find((p: Post) => p.id === id);
  
  if (!post) {
    return (
      <div className="bg-white border border-border-main p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Post Not Found</h1>
        <p className="mb-4">The post you are looking for does not exist or has been removed.</p>
        <Link href="/" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-sm">Go to Homepage</Link>
      </div>
    );
  }
  
  const relatedPosts = posts.filter((p: Post) => p.categorySlug === post.categorySlug && p.id !== post.id).slice(0, 4);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-3/4 flex flex-col gap-6">
        <div className="bg-white border border-border-main p-6">
          <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider self-start">
              {post.categorySlug.replace(/-/g, ' ')}
            </span>
            <AdPlaceholder format="fluid" className="w-full md:w-[320px] h-[50px] !m-0" label="Sponsor" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted border-b border-border-main pb-4 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Published: {post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>By Admin</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag size={16} />
              <span className="capitalize">{post.categorySlug.replace(/-/g, ' ')}</span>
            </div>
          </div>

          <div className="prose max-w-none text-text-main text-sm md:text-base leading-relaxed" 
               dangerouslySetInnerHTML={{ __html: post.content }} />
            
          {post.type === 'PDF' && post.fileUrl && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm my-8">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <Download size={18} /> Download Document
              </h4>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center bg-white p-3 border border-blue-100">
                  <span className="font-medium text-sm">{post.title}.pdf {post.fileSize ? `(${post.fileSize})` : ''}</span>
                  <a href={post.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-secondary text-white px-4 py-1.5 text-sm rounded-sm hover:bg-primary transition-colors inline-block">
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-border-main flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-bold text-text-muted mr-2 flex items-center gap-1"><Share2 size={16} /> Share:</span>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title)} - ${encodeURIComponent(process.env.APP_URL || 'https://www.teacherinfo.net')}/content/${id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                WhatsApp
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.APP_URL || 'https://www.teacherinfo.net')}/content/${id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#1877F2] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                Facebook
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(process.env.APP_URL || 'https://www.teacherinfo.net')}/content/${id}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#1DA1F2] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                Twitter
              </a>
              <a href={`https://t.me/share/url?url=${encodeURIComponent(process.env.APP_URL || 'https://www.teacherinfo.net')}/content/${id}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-[#0088cc] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                Telegram
              </a>
            </div>
            <a href={`javascript:window.print()`} className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1.5 rounded text-text-main hover:bg-gray-200 transition-colors">
              <Printer size={16} /> Print
            </a>
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
            {relatedPosts.map((related: Post) => (
              <li key={related.id}>
                <Link href={`/content/${related.id}`} className="block px-4 py-3 hover:bg-hover-bg transition-colors">
                  <div className="text-sm font-medium text-text-main hover:text-primary mb-1">
                    {related.title}
                  </div>
                  <div className="text-xs text-text-muted">
                    {related.date}
                  </div>
                </Link>
              </li>
            ))}
            {relatedPosts.length === 0 && (
              <li className="px-4 py-3 text-sm text-text-muted">No related content found.</li>
            )}
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
