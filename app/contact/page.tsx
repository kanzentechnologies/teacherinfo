import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Teacher Info Portal for any queries, support, or feedback.',
  openGraph: {
    title: 'Contact Us | Teacher Info Portal',
    description: 'Get in touch with Teacher Info Portal for any queries, support, or feedback.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="bg-white border border-border-main p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 border-b border-border-main pb-4">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Get in Touch</h2>
          <p className="text-sm text-text-main mb-6 leading-relaxed">
            Have questions, suggestions, or need assistance? We&apos;re here to help. Please reach out to us using the contact information below or fill out the contact form.
          </p>
          
          <div className="space-y-4 text-sm text-text-main">
            <div>
              <strong className="block text-primary">Email:</strong>
              <a href="mailto:support@teacherinfo.net" className="text-secondary hover:underline">support@teacherinfo.net</a>
            </div>
            <div>
              <strong className="block text-primary">Working Hours:</strong>
              <p>10:00 AM to 6:00 PM (Monday - Saturday)</p>
            </div>
          </div>
        </div>

        <div>
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
