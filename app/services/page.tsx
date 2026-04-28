import { Metadata } from 'next';
import { getServices } from '@/lib/serviceStore';
import { getNavItemBySlug } from '@/lib/navStore';
import Link from 'next/link';
import { ExternalLink, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Official Services',
  description: 'View our official services and offerings.',
};

export default async function ServicesPage() {
  const services = await getServices();
  const pageContent = await getNavItemBySlug('services');

  return (
    <div className="bg-white border border-border-main p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 border-b border-border-main pb-4 flex items-center gap-2">
        <Briefcase className="text-primary" />
        {pageContent?.title || 'Official Services'}
      </h1>

      {pageContent?.content && (
        <div 
          className="prose max-w-none mb-8 text-text-main text-sm md:text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: pageContent.content }} 
        />
      )}
      
      {services.length === 0 ? (
        <p className="text-text-muted">No services available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const isInternal = service.link?.startsWith('/');
            return (
              <div key={service.id} className="border border-border-main p-5 rounded-sm hover:shadow-sm hover:border-primary transition-colors flex flex-col h-full bg-gray-50">
                <h2 className="text-lg font-bold text-primary mb-2">{service.title}</h2>
                <p className="text-text-muted text-sm flex-grow mb-4">{service.description}</p>
                
                {service.link && (
                  <div className="mt-auto pt-4 border-t border-border-main">
                    {isInternal ? (
                      <Link 
                        href={service.link}
                        className="inline-flex items-center gap-2 text-sm font-bold text-white bg-primary hover:bg-secondary transition-colors px-4 py-2"
                      >
                        Learn More
                      </Link>
                    ) : (
                      <a 
                        href={service.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-white bg-primary hover:bg-secondary transition-colors px-4 py-2"
                      >
                        Access Service
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
