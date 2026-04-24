'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, Edit, Trash2, GripVertical } from 'lucide-react';
import { getContacts, saveContacts, deleteContact, Contact } from '@/lib/contactStore';
import { FileUpload } from '@/components/ui/FileUpload';
import { Reorder } from 'motion/react';
import Image from 'next/image';

export default function ContactManagementPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      setContacts(await getContacts());
    };
    fetchContacts();
  }, []);

  const handleSaveContacts = async (newContacts: Contact[]) => {
    setContacts(newContacts);
    await saveContacts(newContacts);
  };

  const resetForm = () => {
    setName('');
    setDesignation('');
    setEmail('');
    setPhone('');
    setImageUrl('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newContact: Contact = {
      id: editingId || Math.floor(Math.random() * 100000000),
      name,
      designation,
      email,
      phone,
      imageUrl: imageUrl || 'https://picsum.photos/seed/user/200/200',
      order: editingId ? (contacts.find(c => c.id === editingId)?.order || 0) : contacts.length + 1,
    };

    let newContacts = [...contacts];
    if (editingId) {
      newContacts = newContacts.map(c => c.id === editingId ? newContact : c);
    } else {
      newContacts.push(newContact);
    }

    await handleSaveContacts(newContacts);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    await deleteContact(id);
    const newContacts = contacts.filter(c => c.id !== id);
    setContacts(newContacts);
  };

  const handleEdit = (contact: Contact) => {
    setName(contact.name);
    setDesignation(contact.designation);
    setEmail(contact.email);
    setPhone(contact.phone);
    setImageUrl(contact.imageUrl);
    setEditingId(contact.id);
    setIsAdding(true);
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Contact Management</h1>
            <p className="text-sm text-text-muted">Manage team members on the Contact Us page</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Add Contact
          </button>
        </div>

        {isAdding && (
          <div className="bg-white border border-border-main p-6">
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">
              {editingId ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="e.g. John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Designation / Role</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="e.g. Teacher | Location" 
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Phone Number</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="+91 0000000000" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <FileUpload 
                  onUploadSuccess={(url) => setImageUrl(url)} 
                  label="Profile Image" 
                  accept="image/*"
                />
                {imageUrl && (
                  <div className="mt-2 text-xs text-gray-500 break-all">
                    Current URL: {imageUrl}
                  </div>
                )}
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-border-main text-sm font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Contact</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-border-main">
          <div className="bg-gray-100 border-b border-border-main px-4 py-3">
            <h3 className="font-bold text-primary">Current Contacts</h3>
            <p className="text-xs text-text-muted">Drag items to reorder</p>
          </div>
          <div className="p-4">
            <Reorder.Group axis="y" values={contacts} onReorder={handleSaveContacts} className="space-y-2">
              {contacts.map((contact) => (
                <Reorder.Item key={contact.id} value={contact} className="border border-border-main bg-white select-none">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 cursor-grab active:cursor-grabbing p-1 hover:text-primary transition-colors">
                        <GripVertical size={20} />
                      </div>
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image 
                          src={contact.imageUrl} 
                          alt={contact.name}
                          fill
                          className="rounded-full object-cover border border-border-main"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-text-main">{contact.name}</span>
                        <div className="text-xs text-text-muted">{contact.designation}</div>
                        <div className="text-xs text-secondary">{contact.email} | {contact.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(contact)} className="text-secondary hover:underline text-sm flex items-center gap-1"><Edit size={14}/> Edit</button>
                      <button onClick={() => handleDelete(contact.id)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {contacts.length === 0 && (
              <div className="text-center py-10 text-text-muted italic">No contacts added yet.</div>
            )}
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
