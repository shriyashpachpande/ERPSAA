import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const SportsTeacherApprovalDashboardPage = ({ initialStatus = 'pending' }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialStatus); 
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    setFilter(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'all' ? '/api/eventsFacilities/management/requests' : `/api/eventsFacilities/management/requests?status=${filter}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        toast.error("Failed to load requests.");
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`/api/eventsFacilities/management/requests/${id}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(`Request ${action}d successfully.`);
        fetchRequests(); 
      } else {
        toast.error(data.message || `Failed to ${action} request.`);
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-xs font-bold uppercase tracking-wider">Rejected</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>;
    }
  };

  return (
    <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-2xl border-l border-slate-200"
      style={{ boxShadow: "0 0 20px 0px rgba(59, 130, 246, 0.2)" }}
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20"></div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-slate-900">Facility Operations Hub</h1>
            <p className="text-slate-500 text-lg font-medium">Evaluate campus facility requests across 4 operational sectors.</p>
          </div>
          <div className="flex bg-slate-200/50 p-1 rounded-2xl">
            {['pending', 'approved', 'rejected', 'all'].map(f => (
              <button type="button"
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  filter === f 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-16 text-center text-slate-500 shadow-lg backdrop-blur-sm">
             <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
             <h3 className="text-xl font-bold text-slate-700">No {filter !== 'all' ? filter : ''} requests found</h3>
             <p className="mt-2 text-sm">Zone is empty.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden backdrop-blur-xl">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 border-b border-slate-200/60 text-xs uppercase tracking-widest text-slate-500 font-black">
                     <th className="p-5 font-bold">Applicant</th>
                     <th className="p-5 font-bold">Category & Facility</th>
                     <th className="p-5 font-bold">Schedule Allocation</th>
                     <th className="p-5 font-bold">Status</th>
                     <th className="p-5 font-bold text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {requests.map(req => (
                     <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="p-5">
                         <p className="font-bold text-slate-900">{req.studentName}</p>
                         <p className="text-xs text-slate-500 font-medium">Ref: {req._id.substring(0,8)}</p>
                       </td>
                       <td className="p-5">
                         <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-[0.1em] mb-1 border border-blue-100">
                           {String(req.categorySlug || '').replace('-', ' ')}
                         </span>
                         <p className="font-bold text-slate-900 mb-1">{req.facilityName}</p>
                         <p className="text-xs text-slate-500 font-medium line-clamp-2 max-w-xs">{req.purpose}</p>
                       </td>
                       <td className="p-5">
                         <div className="inline-flex flex-col space-y-1 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-sm font-bold text-slate-700">
                           <span>{new Date(req.date).toLocaleDateString()}</span>
                           <span className="text-slate-500 flex items-center text-xs">
                             <Clock className="w-3 h-3 mr-1" /> {req.startTime} - {req.endTime}
                           </span>
                         </div>
                       </td>
                       <td className="p-5">
                          {getStatusBadge(req.status)}
                       </td>
                       <td className="p-5 text-right flex justify-end gap-2 items-center h-full">
                         {req.status === 'pending' ? (
                           <>
                             <button type="button"
                               onClick={() => handleAction(req._id, 'approve')}
                               disabled={actionLoading === req._id}
                               className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-1 active:scale-95"
                             >
                               {actionLoading === req._id ? <RefreshCw className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4"/>}
                               Approve
                             </button>
                             <button type="button"
                               onClick={() => handleAction(req._id, 'reject')}
                               disabled={actionLoading === req._id}
                               className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold border border-rose-200 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-1 active:scale-95"
                             >
                               {actionLoading === req._id ? <RefreshCw className="w-4 h-4 animate-spin"/> : <XCircle className="w-4 h-4"/>}
                               Reject
                             </button>
                           </>
                         ) : (
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 inline-block">Action Taken</span>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SportsTeacherApprovalDashboardPage;
