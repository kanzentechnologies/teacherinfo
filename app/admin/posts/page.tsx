import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';

export default function PostsPage() {
  return (
    <AdminWrapper>
      <div className="flex flex-col gap-6">
        <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Manage Posts</h1>
            <p className="text-sm text-text-muted">View, edit, and delete posts</p>
          </div>
          <Link 
            href="/admin/posts/new" 
            className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Create New Post
          </Link>
        </div>

        <div className="bg-white border border-border-main">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-border-main text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <tr key={i} className="hover:bg-hover-bg">
                    <td className="px-4 py-3 font-medium text-text-main">AP DSC 2024 Notification Details {i}</td>
                    <td className="px-4 py-3 text-text-muted">Job Notifications</td>
                    <td className="px-4 py-3 text-text-muted">12 Apr 2024</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-sm border border-green-200">Published</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/posts/${i}/edit`} className="text-secondary hover:underline mr-3">Edit</Link>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border-main flex justify-center">
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-border-main bg-gray-100 text-text-muted cursor-not-allowed">Previous</button>
              <button className="px-3 py-1 border border-primary bg-primary text-white">1</button>
              <button className="px-3 py-1 border border-border-main hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-border-main hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
