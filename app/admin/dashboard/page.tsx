import Link from 'next/link';
import { PlusCircle, FileText, Users, Settings, Bell, BarChart } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-main p-4 sm:p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-sm text-text-muted">Welcome back, Administrator</p>
        </div>
        <Link 
          href="/admin/content/new" 
          className="bg-accent text-primary font-bold py-2 px-4 rounded-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
        >
          <PlusCircle size={18} />
          Create New Content
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: '1,245', icon: FileText, color: 'text-blue-600' },
          { label: 'Active Users', value: '8,432', icon: Users, color: 'text-green-600' },
          { label: 'Announcements', value: '12', icon: Bell, color: 'text-orange-600' },
          { label: 'Page Views', value: '45.2K', icon: BarChart, color: 'text-purple-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-border-main p-4 flex items-center gap-4">
              <div className={`p-3 bg-gray-100 rounded-full ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <div className="text-sm text-text-muted font-medium">{stat.label}</div>
                <div className="text-2xl font-bold text-text-main">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-border-main">
        <div className="bg-gray-100 border-b border-border-main px-4 py-3 flex justify-between items-center">
          <h3 className="font-bold text-primary">Recent Content</h3>
          <Link href="/admin/content" className="text-sm text-secondary hover:underline">View All</Link>
        </div>
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
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-hover-bg">
                  <td className="px-4 py-3 font-medium text-text-main">AP DSC 2024 Notification Details {i}</td>
                  <td className="px-4 py-3 text-text-muted">Job Notifications</td>
                  <td className="px-4 py-3 text-text-muted">12 Apr 2024</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-sm border border-green-200">Published</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/content/${i}/edit`} className="text-secondary hover:underline mr-3">Edit</Link>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
