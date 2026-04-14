'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Phone, User } from 'lucide-react';
import { getContacts, Contact } from '@/lib/contactStore';

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContacts(getContacts());
  }, []);

  return (
    <div className="bg-white border border-border-main p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 border-b border-border-main pb-4">Contact Us</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-primary mb-6">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

          <div className="mt-10 pt-10 border-t border-border-main">
            <h2 className="text-xl font-bold text-primary mb-4">Contact Form</h2>
            <p className="text-sm text-text-main leading-relaxed">
              If you have any other questions or need specific assistance, please use the contact form on the right to send us a message directly.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary mb-6">Send a Message</h2>
          <form className="space-y-4 bg-gray-50 p-6 border border-border-main">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-primary mb-1">Full Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-primary mb-1">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-primary mb-1">Subject</label>
              <input 
                type="text" 
                id="subject" 
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
                placeholder="Brief subject of your message"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-primary mb-1">Message</label>
              <textarea 
                id="message" 
                rows={4}
                className="w-full border border-border-main p-2 text-sm focus:outline-none focus:border-secondary"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button 
              type="button"
              className="w-full bg-primary text-white font-bold py-2 px-4 rounded-sm hover:bg-secondary transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
