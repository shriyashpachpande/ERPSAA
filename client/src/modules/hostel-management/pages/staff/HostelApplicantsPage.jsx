import React, { useState, useEffect, useRef } from 'react';
import { getAllApplications, updateApplicationStatus } from '../../services/hostelService';
import { 
  Users, Check, X, Clock, AlertCircle, 
  Search, Filter, ChevronRight, User, GraduationCap, MapPin, Home
} from 'lucide-react';
import gsap from 'gsap';

const HostelApplicantsPage = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [remarks, setRemarks] = useState('');

  const fetchApplications = async () => {
    try {
      const res = await getAllApplications();
      setApplications(res.data || []);
      setFilteredApps(res.data || []);
    } catch (err) {
      setError('Failed to fetch applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let result = applications;
    if (statusFilter !== 'All') {
      result = result.filter(app => app.status === statusFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(app => 
        app.studentId?.personalDetails?.fullName.toLowerCase().includes(s) ||
        app.studentId?.studentId.toLowerCase().includes(s)
      );
    }
    setFilteredApps(result);
  }, [search, statusFilter, applications]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-row'),
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [loading, filteredApps.length]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateApplicationStatus(id, { status, adminRemarks: remarks });
      setSelectedApp(null);
      setRemarks('');
      fetchApplications();
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ";
    switch (status) {
      case 'Pending': return base + "bg-amber-50 text-amber-600 border-amber-100";
      case 'Approved': return base + "bg-indigo-50 text-indigo-600 border-indigo-100";
      case 'Allocated': return base + "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'Waitlisted': return base + "bg-blue-50 text-blue-600 border-blue-100";
      case 'Rejected': return base + "bg-rose-50 text-rose-600 border-rose-100";
      default: return base + "bg-gray-50 text-gray-400 border-gray-100";
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto pb-20" ref={containerRef}>
      <div className="stagger-item mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Hostel Admission Queue</h1>
        <p className="text-gray-500">Review and manage student applications for hostel accommodation.</p>
      </div>

      <div className="stagger-item bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
           {['All', 'Pending', 'Approved', 'Waitlisted', 'Allocated', 'Rejected'].map(f => (
             <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-400 border border-gray-100 hover:border-indigo-200 hover:text-indigo-600'}`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      <div className="stagger-item bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preferences</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app._id} className="stagger-row hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                          {app.studentId?.personalDetails?.fullName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{app.studentId?.personalDetails?.fullName}</p>
                          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{app.studentId?.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-700">{app.hostelType} Hostel</p>
                        <p className="text-[10px] text-gray-400 font-medium">{app.preferredRoomType} Seater</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-gray-600">{new Date(app.createdAt).toLocaleDateString()}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={getStatusBadge(app.status)}>{app.status}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {app.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                           <button 
                            onClick={() => setSelectedApp(app)}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            title="Take Action"
                           >
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8" />
                    </div>
                    <p className="text-gray-400 font-medium">No applications found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <h3 className="text-lg font-black text-gray-900">Application Review</h3>
                 <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white rounded-xl transition-all">
                    <X className="w-5 h-5 text-gray-400" />
                 </button>
              </div>
              
              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <User className="w-10 h-10 p-2 bg-indigo-50 text-indigo-600 rounded-xl" />
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Applicant</p>
                              <p className="text-sm font-black text-gray-900">{selectedApp.studentId?.personalDetails?.fullName || 'Unknown Student'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <GraduationCap className="w-10 h-10 p-2 bg-purple-50 text-purple-600 rounded-xl" />
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Course / Year</p>
                              <p className="text-sm font-black text-gray-900">{selectedApp.studentId?.academicProfile?.course} - Year {selectedApp.studentId?.academicProfile?.yearNumber || 1}</p>
                           </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Home className="w-10 h-10 p-2 bg-emerald-50 text-emerald-600 rounded-xl" />
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Preference</p>
                              <p className="text-sm font-black text-gray-900">{selectedApp.hostelType} | {selectedApp.preferredRoomType} Seater</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <MapPin className="w-10 h-10 p-2 bg-rose-50 text-rose-600 rounded-xl" />
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Contact</p>
                              <p className="text-sm font-black text-gray-900">{selectedApp.studentId?.personalDetails?.mobileNumber || 'N/A'}</p>
                           </div>
                        </div>
                    </div>
                 </div>

                 {selectedApp.status === 'Pending' && (
                   <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-left">Admin Remarks / Notes</label>
                        <textarea 
                          rows="3"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Add reason for approval/rejection or waitlist notes..."
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 transition-all outline-none resize-none"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                         <button 
                          onClick={() => handleStatusUpdate(selectedApp._id, 'Approved')}
                          className="p-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex flex-col items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                         >
                            <Check className="w-5 h-5" /> Approve
                         </button>
                         <button 
                          onClick={() => handleStatusUpdate(selectedApp._id, 'Waitlisted')}
                          className="p-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex flex-col items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                         >
                            <Clock className="w-5 h-5" /> Waitlist
                         </button>
                         <button 
                          onClick={() => handleStatusUpdate(selectedApp._id, 'Rejected')}
                          className="p-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex flex-col items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                         >
                            <X className="w-5 h-5" /> Reject
                         </button>
                      </div>
                   </div>
                 )}
                 
                 {selectedApp.status !== 'Pending' && (
                   <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Final Remarks</p>
                      <p className="text-sm font-bold text-gray-800 italic">{selectedApp.adminRemarks || 'No remarks provided.'}</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default HostelApplicantsPage;
