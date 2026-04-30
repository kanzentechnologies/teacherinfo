'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Phone, User } from 'lucide-react';
import { getContacts, Contact } from '@/lib/contactStore';

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      setContacts(await getContacts());
    };
    fetchContacts();
  }, []);

  return (
    <div className="bg-white border border-border-main p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 border-b border-border-main pb-4">Contact Us</h1>
      
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="text-xl font-bold text-primary mb-6">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="border border-border-main p-4 flex flex-col items-center text-center bg-gray-50 hover:shadow-md transition-shadow">
                <div className="relative w-24 h-24 mb-4">
                  <Image 
                    src={contact.imageUrl} 
                    alt={contact.name}
                    fill
                    className="rounded-full object-cover border-2 border-primary"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-bold text-primary text-lg">{contact.name}</h3>
                <p className="text-xs text-secondary font-medium mb-3">{contact.designation}</p>
                
                <div className="space-y-2 w-full text-sm">
                  <div className="flex items-center justify-center gap-2 text-text-main">
                    <Mail size={14} className="text-secondary" />
                    <a href={`mailto:${contact.email}`} className="hover:text-secondary hover:underline truncate">{contact.email}</a>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-text-main">
                    <Phone size={14} className="text-secondary" />
                    <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="hover:text-secondary hover:underline">{contact.phone}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
