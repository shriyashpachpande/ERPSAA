import { Users, CheckCircle, FileText, AlertCircle } from 'lucide-react';

const AdmissionDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admission Management</h1>
          <p className="text-sm text-gray-500">Review applications, applicant statuses, and complete enrollments.</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors">
          + Start New Admission
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-blue-500 hover:-translate-y-1 transition-transform">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Applications</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">1,245</h3>
            <Users className="w-8 h-8 text-blue-100" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-green-500 hover:-translate-y-1 transition-transform">
          <p className="text-sm font-medium text-gray-500 mb-1">Verified & Approved</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">890</h3>
            <CheckCircle className="w-8 h-8 text-green-100" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-amber-500 hover:-translate-y-1 transition-transform">
          <p className="text-sm font-medium text-gray-500 mb-1">Under Review</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">124</h3>
            <FileText className="w-8 h-8 text-amber-100" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-rose-500 hover:-translate-y-1 transition-transform">
          <p className="text-sm font-medium text-gray-500 mb-1">Re-upload Requested</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">42</h3>
            <AlertCircle className="w-8 h-8 text-rose-100" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
            <div className="flex space-x-2">
              <input type="text" placeholder="Search ID or Name" className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Application ID</th>
                  <th className="p-4 font-semibold">Applicant Name</th>
                  <th className="p-4 font-semibold">Program</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Submitted On</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { id: 'APP-2026-001', name: 'Ritesh Kumar', course: 'B.Tech IT', status: 'Under Review', color: 'bg-amber-100 text-amber-800', date: 'Oct 24, 2026' },
                  { id: 'APP-2026-002', name: 'Simran Kaur', course: 'BBA', status: 'Approved', color: 'bg-green-100 text-green-800', date: 'Oct 23, 2026' },
                  { id: 'APP-2026-003', name: 'Raj Gupta', course: 'MBA HR', status: 'Re-upload', color: 'bg-rose-100 text-rose-800', date: 'Oct 22, 2026' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-sm text-gray-900">{row.id}</td>
                    <td className="p-4 text-sm text-gray-600">{row.name}</td>
                    <td className="p-4 text-sm text-gray-500">{row.course}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{row.date}</td>
                    <td className="p-4 text-right">
                      <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdmissionDashboard;
