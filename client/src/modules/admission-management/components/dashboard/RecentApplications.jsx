import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronRight, User } from 'lucide-react';
import gsap from 'gsap';

const StatusBadge = ({ status }) => {
  const styles = {
    submitted: 'bg-blue-100 text-blue-700 border-blue-200',
    under_review: 'bg-amber-100 text-amber-700 border-amber-200',
    reupload_requested: 'bg-red-100 text-red-700 border-red-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-gray-100 text-gray-700 border-gray-200',
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    pending_clarification: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status] || styles.draft}`}>
      {(status || 'unknown').replace('_', ' ')}
    </span>
  );
};

const RecentApplications = ({ applications }) => {
  const navigate = useNavigate();
  const tableRef = useRef(null);

  useEffect(() => {
    if (applications && applications.length > 0 && tableRef.current) {
      gsap.fromTo(
        tableRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [applications]);

  if (!applications || applications.length === 0) return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center text-gray-400 font-medium">
      No recent applications
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 pb-2 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
          <p className="text-xs text-gray-500">Latest updates from candidates</p>
        </div>
        <button 
          onClick={() => navigate('/app/staff/admissions')}
          className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center group px-3 py-1 rounded-lg hover:bg-primary-50 transition-colors"
        >
          View All <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">App ID</th>
              <th className="px-6 py-4 font-bold text-primary-600">Department</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody ref={tableRef} className="divide-y divide-gray-50">
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-50 to-indigo-50 text-primary-700 flex items-center justify-center text-xs font-black border border-primary-100 shadow-sm uppercase">
                      {app.personalDetails?.fullName?.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                    <div className="ml-3 truncate max-w-[140px]">
                      <p className="text-sm font-bold text-gray-900 leading-tight truncate">
                        {app.personalDetails?.fullName || 'Anonymous'}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium truncate">{app.personalDetails?.email || 'No email'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{app.applicationId}</span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">{app.courseSelection?.department || 'Not Specified'}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{app.courseSelection?.course || 'General'}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                   </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={app.applicationStatus} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => navigate(`/app/staff/admissions/${app._id}`)}
                    className="flex justify-center items-center ml-auto w-8 h-8 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-100 transition-all shadow-sm group-hover:scale-110 active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplications;
