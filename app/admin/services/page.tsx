'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { PlusCircle, Edit, Trash2, GripVertical } from 'lucide-react';
import { getServices, saveServices, deleteService, Service } from '@/lib/serviceStore';
import { Reorder } from 'motion/react';
import { PageLinkSelector } from '@/components/admin/PageLinkSelector';
import { getNavItemBySlug, saveNavItem, NavItem } from '@/lib/navStore';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function ServiceManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state for cards
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  // Page Intro state
  const [pageItem, setPageItem] = useState<NavItem | null>(null);
  const [pageContent, setPageContent] = useState('');
  const [isEditingIntro, setIsEditingIntro] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setServices(await getServices());
      const pItem = await getNavItemBySlug('services');
      if (pItem) {
        setPageItem(pItem);
        setPageContent(pItem.content || '');
      }
    };
    fetchData();
  }, []);

  const handleSaveServices = async (newServices: Service[]) => {
    setServices(newServices);
    await saveServices(newServices);
  };

  const handleSaveIntro = async () => {
    if (!pageItem) return;
    try {
      await saveNavItem({ ...pageItem, content: pageContent });
      alert('Services page intro updated!');
      setIsEditingIntro(false);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLink('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !link) return;

    const newService: Service = {
      id: editingId || Date.now(),
      title,
      description,
      link,
      order: editingId ? (services.find(s => s.id === editingId)?.order || 0) : services.length + 1,
    };

    let newServices = [...services];
    if (editingId) {
      newServices = newServices.map(s => s.id === editingId ? newService : s);
    } else {
      newServices.push(newService);
    }

    await handleSaveServices(newServices);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    await deleteService(id);
    const newServices = services.filter(s => s.id !== id);
    setServices(newServices);
  };

  const handleEdit = (service: Service) => {
    setTitle(service.title);
    setDescription(service.description);
    setLink(service.link);
    setEditingId(service.id);
    setIsAdding(true);
  };

  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Service Management</h1>
            <p className="text-sm text-text-muted">Manage the Official Services page and homepage cards</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Add Service Card
          </button>
        </div>

        {/* Services Page Intro Content Section */}
        <div className="bg-white border border-border-main">
          <div className="bg-gray-100 border-b border-border-main px-4 py-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-primary">Services Page: Intro Content</h3>
              <p className="text-xs text-text-muted">This text appears at the top of the /services page</p>
            </div>
            {!isEditingIntro ? (
              <button 
                onClick={() => setIsEditingIntro(true)}
                className="text-secondary hover:underline text-sm font-bold flex items-center gap-1"
              >
                <Edit size={14} /> Edit Intro Text
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditingIntro(false)}
                  className="text-text-muted hover:underline text-sm font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveIntro}
                  className="text-primary bg-accent px-3 py-1 rounded-sm text-sm font-bold"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
          <div className="p-4">
            {isEditingIntro ? (
              <div className="border border-border-main min-h-[300px]">
                <RichTextEditor 
                  value={pageContent}
                  onChange={setPageContent}
                  placeholder="Enter the introductory text for the services page..."
                />
              </div>
            ) : (
              <div 
                className="prose prose-sm max-w-none text-text-main line-clamp-3 bg-gray-50 p-3"
                dangerouslySetInnerHTML={{ __html: pageContent || '<p className="italic text-text-muted">No intro content set. Click edit to add text.</p>' }}
              />
            )}
          </div>
        </div>

        {isAdding && (
          <div className="bg-white border border-border-main p-6">
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border-main pb-2">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="e.g. Income Tax Returns" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Description (Optional)</label>
                <textarea 
                  className="w-full border border-border-main p-2 text-sm" 
                  placeholder="e.g. Click here to go to the portal" 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <PageLinkSelector 
                  value={link}
                  onChange={setLink}
                  label="URL / Link"
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-border-main text-sm font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-bold">Save Service</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-border-main">
          <div className="bg-gray-100 border-b border-border-main px-4 py-3">
            <h3 className="font-bold text-primary">Current Services</h3>
            <p className="text-xs text-text-muted">Drag items to reorder</p>
          </div>
          <div className="p-4">
            <Reorder.Group axis="y" values={services} onReorder={handleSaveServices} className="space-y-2">
              {services.map((service) => (
                <Reorder.Item key={service.id} value={service} className="border border-border-main bg-white select-none">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 cursor-grab active:cursor-grabbing p-1 hover:text-primary transition-colors">
                        <GripVertical size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-text-main">{service.title}</span>
                        <div className="text-xs text-text-muted line-clamp-1">{service.description}</div>
                        <div className="text-xs text-secondary truncate max-w-[300px]">{service.link}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(service)} className="text-secondary hover:underline text-sm flex items-center gap-1"><Edit size={14}/> Edit</button>
                      <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {services.length === 0 && (
              <div className="text-center py-10 text-text-muted italic">No services added yet.</div>
            )}
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
