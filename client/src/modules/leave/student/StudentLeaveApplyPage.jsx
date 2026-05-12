import React, { useState, useRef, useEffect } from 'react';
import { Calendar, FileText, Upload, ChevronRight, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import toast from 'react-hot-toast';

const StudentLeaveApplyPage = () => {
  const [formData, setFormData] = useState({
    leaveType: 'Casual',
    fromDate: '',
    toDate: '',
    reason: '',
    document: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [balance, setBalance] = useState(null);
  const [fetchingBalance, setFetchingBalance] = useState(true);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch balance
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/leave/balance', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setBalance(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setFetchingBalance(false);
      }
    };
    fetchBalance();

    // Entry animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'document') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.leaveType === 'Medical' && !formData.document) {
      toast.error('Medical certificate is strictly required for Medical Leave.');
      return;
    }

    if (balance) {
      const dFrom = new Date(formData.fromDate);
      const dTo = new Date(formData.toDate);
      if (dFrom > dTo) {
        toast.error('Invalid Date Range');
        return;
      }
      const duration = Math.ceil((dTo - dFrom) / (1000 * 60 * 60 * 24)) + 1;
      if (balance.remainingLeaves < duration) {
        toast.error(`You only have ${balance.remainingLeaves} leaves remaining.`);
        return;
      }
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // For phase 1 we might skip exact file upload to S3 and just send data if it's basic
      // If server expects multipart form data we use FormData

      const payload = {
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
        document: formData.document ? formData.document.name : ''
      };

      const res = await fetch('/api/leave/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        toast.success("Leave Request Submitted successfully!");
        setTimeout(() => {
          navigate('/app/student/leave/history');
        }, 1500);
      } else {
        toast.error(data.error || "Failed to submit leave request.");
      }
    } catch (err) {
      toast.error('Network error during submission.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen p-6 lg:p-10 bg-slate-50 text-slate-800 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 max-w-md w-full text-center flex flex-col items-center shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex flex-col items-center justify-center text-emerald-600 mb-6 shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black mb-2 text-slate-900">Request Submitted</h2>
          <p className="text-slate-500 mb-8 font-medium">Your leave application is pending approval.</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-2xl rounded-bl-2xl border-l border-slate-200"
      style={{ boxShadow: "0 0 20px 0px rgba(239, 68, 68, 0.29)" }}


    >
      {/* Dynamic Light Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/10 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none -mb-20 -ml-20"></div>

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-primary-100 shadow-sm">
              <FileText className="w-3.5 h-3.5" />
              <span>Leave Application System</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-slate-900">Apply for Leave</h1>
            <p className="text-slate-500 text-lg font-medium">Submit and track your time-off requests with precision.</p>
          </div>

          {/* Premium Light Balance Cards */}
          {balance && !fetchingBalance && (
            <div className="flex gap-4">
              <div className="bg-white backdrop-blur-md border border-slate-200 shadow-lg shadow-slate-200/50 rounded-2xl p-5 min-w-[130px] flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Balance
                </p>
                <p className="text-4xl font-black text-slate-900">{balance.remainingLeaves} <span className="text-base font-bold text-slate-400">/{balance.totalLeaves}</span></p>
              </div>
              <div className="bg-white backdrop-blur-md border border-slate-200 shadow-lg shadow-slate-200/50 rounded-2xl p-5 min-w-[130px] flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                <p className="text-[10px] text-rose-500 uppercase tracking-widest font-black mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Used
                </p>
                <p className="text-4xl font-black text-slate-900">{balance.usedLeaves}</p>
              </div>
            </div>
          )}
        </header>

        <form onSubmit={handleSubmit} ref={formRef} className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-8 lg:p-12 shadow-xl shadow-slate-200/40 backdrop-blur-xl relative"
          style={{ boxShadow: "0 0 20px 0px rgba(138, 92, 246, 0.4)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Leave Classification</label>
              <div className="relative group">
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 group-hover:border-primary-300 rounded-2xl pl-5 pr-10 py-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-slate-800 appearance-none text-sm font-bold shadow-sm"
                >
                  <option value="Casual" className="font-medium">Casual Leave</option>
                  <option value="Medical" className="font-medium">Medical Leave</option>
                  <option value="Emergency" className="font-medium">Emergency Leave</option>
                </select>
                <ChevronRight className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
              </div>
            </div>

            <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 md:col-span-2">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Departure Date</label>
                <div className="relative flex items-center group">
                  <Calendar className="w-4 h-4 absolute left-5 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors" />
                  <input
                    type="date"
                    name="fromDate"
                    required
                    value={formData.fromDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 group-hover:border-primary-300 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-slate-800 text-sm font-bold shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Return Date</label>
                <div className="relative flex items-center group">
                  <Calendar className="w-4 h-4 absolute left-5 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors" />
                  <input
                    type="date"
                    name="toDate"
                    required
                    value={formData.toDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 group-hover:border-primary-300 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-slate-800 text-sm font-bold shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Comprehensive Statement / Reason</label>
              <textarea
                name="reason"
                required
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                placeholder="Detail the circumstances requiring your absence..."
                className="w-full bg-slate-50 border border-slate-200 hover:border-primary-300 rounded-2xl px-5 py-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-slate-800 resize-none text-sm font-semibold shadow-sm leading-relaxed placeholder-slate-400"
              ></textarea>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] flex items-center">
                Supporting Documentation {formData.leaveType === 'Medical' && <span className="text-rose-600 ml-2 py-0.5 px-2 bg-rose-50 rounded border border-rose-200 shadow-sm">Strictly Required</span>}
              </label>
              <div className="w-full border-2 border-dashed border-slate-300 rounded-[2rem] p-10 hover:bg-slate-50 hover:border-primary-400 transition-all text-center cursor-pointer relative group bg-slate-50/50">
                <input type="file" name="document" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-100 group-hover:text-primary-600 transition-colors shadow-sm">
                    <Upload className="w-7 h-7 text-slate-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 mb-1 group-hover:text-primary-600 transition-colors">{formData.document ? formData.document.name : 'Click or Drag Medical Proof to Upload'}</p>
                    <p className="text-xs text-slate-500 font-medium">PDF, JPG, or PNG (Max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-cyan-500 hover:from-primary-500 hover:to-cyan-400 text-white font-black tracking-wide py-5 rounded-2xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all flex items-center justify-center active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 uppercase text-sm"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>Submit Application Securely <ChevronRight className="w-5 h-5 ml-3" /></>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentLeaveApplyPage;
