import React, { useState, useEffect } from 'react';
import { getMyRequests, submitMaintenanceRequest } from '../../services/hostelService';
import { Wrench, Plus, Clock, CheckCircle2, MessageCircle, AlertTriangle, ChevronRight, X } from 'lucide-react';
import gsap from 'gsap';

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
    'In-Progress': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Closed': 'bg-gray-50 text-gray-500 border-gray-100'
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
};

const MaintenanceRequestsPage = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    location: 'Room',
    urgency: 'Medium'
  });

  const issueTypes = [
    'Electrical (Fan, Light, Switch)',
    'Plumbing (Tap, Leakage, Flush)',
    'Carpentry (Bed, Table, Door)',
    'Civil (Wall, Paint, Seepage)',
    'Cleaning/Housekeeping',
    'Other'
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getMyRequests();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.stagger-item',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitMaintenanceRequest(formData);
      setIsModalOpen(false);
      setFormData({ issueType: '', description: '', location: 'Room', urgency: 'Medium' });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="stagger-item flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Maintenance Requests</h1>
          <p className="text-gray-500 font-medium text-sm">Report repairs and service needs for your room or block.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.length === 0 ? (
          <div className="stagger-item bg-gray-50 rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Wrench className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active requests</h3>
            <p className="text-gray-500 font-medium mb-0">Everything seems to be working fine!</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="stagger-item bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${request.urgency === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'
                    }`}>
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{request.issueType}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{request.location} • {new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <StatusBadge status={request.status} />
              </div>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {request.description}
              </p>
              {request.adminRemarks && (
                <div className="flex items-start gap-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                  <Clock className="w-4 h-4 text-indigo-500 mt-1" />
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Worker Update</p>
                    <p className="text-sm font-bold text-indigo-900">{request.adminRemarks}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Request Repair</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Issue Type</label>
                  <select
                    required
                    value={formData.issueType}
                    onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {issueTypes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Urgency</label>
                  <select
                    required
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 outline-none transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High / Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 outline-none transition-all"
                  placeholder="e.g. Room 203, Common Bath, Corridor"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 outline-none transition-all resize-none"
                  placeholder="Describe the problem..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Post Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceRequestsPage;
