import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Service } from '@/lib/serviceStore';

export function ServicesBox({ services }: { services: Service[] }) {
  if (!services || services.length === 0) return null;
  return (
    <div className="bg-white border border-border-main">
      <div className="bg-primary border-b border-primary px-4 py-3 flex items-center gap-2">
        <Briefcase className="text-white shrink-0" size={18} />
        <h2 className="font-bold text-white text-lg">Official Services</h2>
      </div>
      <ul className="divide-y divide-border-main">
        {services.map((service) => (
          <li key={service.id} className="p-3 hover:bg-gray-50 flex flex-col gap-1">
            <a 
              href={service.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary font-bold text-sm block"
              title={service.description}
            >
              {service.title}
            </a>
            {service.description && (
              <p className="text-xs text-text-muted">{service.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
