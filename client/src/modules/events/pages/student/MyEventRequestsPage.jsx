import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, AlertCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyEventRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/events/my-requests', {
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

  const cancelRequest = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking request?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/cancel/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Request canceled successfully.");
        fetchRequests();
      } else {
        toast.error(data.message || "Failed to cancel request.");
      }
    } catch (err) {
      toast.error("Network error.");
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

  const filtered = requests.filter(r => 
    r.facility.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-2xl rounded-bl-2xl border-l border-slate-200"
      style={{ boxShadow: "0 0 20px 0px rgba(59, 130, 246, 0.2)" }}
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100 shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>Campus Facility</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-slate-900">My Requests</h1>
            <p className="text-slate-500 text-lg font-medium">Track your facility booking applications and statuses.</p>
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search facility or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-full pl-12 pr-6 py-3 w-full md:w-80 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm shadow-sm"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-16 text-center text-slate-500 shadow-lg backdrop-blur-sm">
             <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
             <h3 className="text-xl font-bold text-slate-700">No requests found</h3>
             <p className="mt-2 text-sm">You haven't made any facility booking requests yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(req => (
              <div key={req._id} className="bg-white border border-slate-200 hover:border-blue-300 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all group relative overflow-hidden flex flex-col justify-between">
                
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  req.status === 'approved' ? 'bg-emerald-500' : 
                  req.status === 'rejected' ? 'bg-rose-500' :
                  req.status === 'cancelled' ? 'bg-slate-500' : 'bg-amber-500'
                }`}></div>

                <div>
                  <div className="flex justify-between items-start mb-4">
                    {getStatusBadge(req.status)}
                    {req.status === 'pending' && (
                      <button 
                        onClick={() => cancelRequest(req._id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Cancel Request"
                      >
                         <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-1">{req.facility}</h3>
                  <p className="text-sm font-medium text-slate-500 line-clamp-2 min-h-[40px] mb-4">{req.purpose}</p>

                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center text-sm font-bold text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-400 mr-3" />
                      {new Date(req.date).toLocaleDateString('en-GB')}
                    </div>
                    <div className="flex items-center text-sm font-bold text-slate-700">
                      <Clock className="w-4 h-4 text-slate-400 mr-3" />
                      {req.startTime} - {req.endTime}
                    </div>
                  </div>
                </div>

                {req.reviewNote && (
                  <div className="mt-4 p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs font-medium text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{req.reviewNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventRequestsPage;
