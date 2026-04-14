'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { getServices, Service } from '@/lib/serviceStore';

export default function ServicesCategoryPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setServices(getServices());
  }, []);

  return (
    <div className="bg-white border border-border-main p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 border-b border-border-main pb-4">Services We Offer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="border border-border-main p-6 bg-gray-50 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <h2 className="text-xl font-bold text-primary mb-2">{service.title}</h2>
              <p className="text-sm text-text-main mb-6 leading-relaxed">
                {service.description}
              </p>
            </div>
            
            <a 
              href={service.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-sm hover:bg-green-700 transition-colors w-fit"
            >
              <MessageCircle size={18} />
              Visit Service
            </a>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-20 text-text-muted italic">
          No services listed at the moment.
        </div>
      )}
    </div>
  );
}
