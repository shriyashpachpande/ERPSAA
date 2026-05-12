import React, { useState, useEffect, useMemo } from 'react';
import { getMyComplaints, submitComplaint } from '../../services/hostelService';
import { 
  MessageSquare, Plus, Clock, CheckCircle2, 
  AlertCircle, X, Search, Sparkles, Zap, 
  Droplets, Hammer, Wifi, Coffee, Users, 
  HelpCircle, ChevronRight, Filter
} from 'lucide-react';
import gsap from 'gsap';

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
    'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'In-Progress': 'bg-sky-50 text-sky-600 border-sky-100',
    'Closed': 'bg-gray-50 text-gray-500 border-gray-100'
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
};

const CategoryIcon = ({ category }) => {
  const icons = {
    'Cleanliness': <Sparkles className="w-5 h-5" />,
    'Electricity/Electrical': <Zap className="w-5 h-5" />,
    'Water/Plumbing': <Droplets className="w-5 h-5" />,
    'Furniture/Woodwork': <Hammer className="w-5 h-5" />,
    'Internet/Wi-Fi': <Wifi className="w-5 h-5" />,
    'Food/Mess': <Coffee className="w-5 h-5" />,
    'Co-Resident Issue': <Users className="w-5 h-5" />,
    'Other': <HelpCircle className="w-5 h-5" />
  };
  return (
    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
      {icons[category] || icons['Other']}
    </div>
  );
};

const HostelComplaintsPage = () => {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: '',
    urgency: 'Normal'
  });

  const categories = [
    'Cleanliness',
    'Electricity/Electrical',
    'Water/Plumbing',
    'Furniture/Woodwork',
    'Internet/Wi-Fi',
    'Food/Mess',
    'Co-Resident Issue',
    'Other'
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getMyComplaints();
      if (res.success) {
        setComplaints(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => 
      (c.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c._id && c._id.slice(-6).includes(searchTerm))
    );
  }, [complaints, searchTerm]);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.stagger-op', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitComplaint(formData);
      setIsModalOpen(false);
      setFormData({ subject: '', category: '', description: '', urgency: 'Normal' });
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 stagger-op">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Hostel Complaints</h1>
          <p className="text-slate-500 font-medium text-sm">Raise issues related to your hostel stay for warden review.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search complaints..."
              className="pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl w-full md:w-64 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium text-sm text-slate-700 transition-all shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Complaint
          </button>
        </div>
      </div>

      {/* COMPLAINTS LIST */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="stagger-op py-24 text-center bg-white border border-dashed border-slate-200 rounded-[3rem]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No complaints have been raised yet.</h3>
            <p className="text-slate-500 font-medium text-sm">Click "New Complaint" to submit an issue.</p>
          </div>
        ) : (
          filteredComplaints.map((c) => (
            <div 
              key={c._id} 
              className="stagger-op group bg-white p-5 md:p-6 rounded-[1.5rem] border border-slate-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5 flex-1 w-full">
                <CategoryIcon category={c.category} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-slate-900 truncate">{c.category}</h3>
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-wider">#{c._id?.slice(-6)}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium truncate max-w-lg mb-1">{c.subject}</p>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                <StatusBadge status={c.status} />
                <button 
                  onClick={() => setSelectedComplaint(c)}
                  className="px-5 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 group/btn"
                >
                  View Complaint
                  <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DETAIL DRAWER / MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" onClick={() => setSelectedComplaint(null)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Complaint Details</h2>
                    <p className="text-[10px] font-black text-slate-400 capitalize">#{selectedComplaint._id?.slice(-6)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
             </div>
             
             <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Category</p>
                    <p className="font-black text-slate-900">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Status</p>
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Subject</p>
                  <p className="text-lg font-black text-slate-900">{selectedComplaint.subject}</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Description</p>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{selectedComplaint.description}"</p>
                </div>

                {selectedComplaint.adminRemarks && (
                  <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
                     <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> Warden Action Remarks
                     </p>
                     <p className="text-sm font-bold leading-relaxed">{selectedComplaint.adminRemarks}</p>
                  </div>
                )}
             </div>

             <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Submitted on: {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                <button onClick={() => setSelectedComplaint(null)} className="py-3 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Close Viewer</button>
             </div>
          </div>
        </div>
      )}

      {/* NEW COMPLAINT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-none mb-1">New Complaint</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share your feedback or report an issue</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Category</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-800 outline-none transition-all appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Urgency</label>
                  <select 
                    required
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-800 outline-none transition-all appearance-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">Urgent / High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-800 outline-none transition-all"
                  placeholder="e.g. Wi-Fi signal dropping in Block A"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-800 outline-none transition-all resize-none"
                  placeholder="Please provide detailed information..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting Issue...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelComplaintsPage;
