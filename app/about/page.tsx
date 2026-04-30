import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Teacher Info Portal, our mission to empower educators with quality study materials, previous papers, and job notifications.',
  openGraph: {
    title: 'About Us | Teacher Info Portal',
    description: 'Learn about Teacher Info Portal, our mission to empower educators with quality study materials, previous papers, and job notifications.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="bg-white border border-border-main p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 border-b border-border-main pb-4">About Teacher Info Portal</h1>
      
      <div className="prose max-w-none text-text-main text-sm md:text-base leading-relaxed space-y-6 break-words overflow-hidden">
        <p>
          Welcome to the <strong>Teacher Info Portal</strong>, your comprehensive and reliable source for educational resources, job notifications, and the latest updates tailored specifically for teaching professionals and aspirants.
        </p>
        
        <h2 className="text-xl font-bold text-primary mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to empower educators by providing easy access to high-quality study materials, previous examination papers, and timely information regarding government and private teaching job opportunities. We aim to bridge the information gap and support teachers in their professional growth and career advancement.
        </p>

        <h2 className="text-xl font-bold text-primary mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Latest Updates:</strong> Stay informed with real-time announcements regarding educational policies, exam schedules, and results.</li>
          <li><strong>Study Materials:</strong> Access a vast repository of subject-wise notes, important questions, and comprehensive guides designed to aid in exam preparation and classroom teaching.</li>
          <li><strong>Previous Papers:</strong> Download past question papers for various competitive exams like AP DSC, TET, SSC, and more, complete with answer keys.</li>
          <li><strong>Job Notifications:</strong> Get timely alerts for teaching vacancies in government schools, private institutions, and other educational organizations.</li>
          <li><strong>Downloads:</strong> Easily download essential forms, syllabi, and official documents required for various administrative and academic purposes.</li>
        </ul>

        <h2 className="text-xl font-bold text-primary mt-8 mb-4">Disclaimer</h2>
        <div className="bg-gray-50 border border-border-main p-4 text-sm text-text-muted">
          <p>
            This website is an independent informational portal and is <strong>not affiliated with any government organization or official body</strong>. While we strive to ensure the accuracy and timeliness of the information provided, we recommend verifying details from official sources before making any decisions based on the content available here.
          </p>
        </div>
      </div>
    </div>
  );
}
