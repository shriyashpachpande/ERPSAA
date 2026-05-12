import React, { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, Clock, ChevronRight, CheckCircle, Activity, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import toast from 'react-hot-toast';

const facilities = [
  'Auditorium', 'Badminton Court', 'Carrom Room', 'Chess Room',
  'Conference Hall', 'Main Ground', 'Basketball Court', 'Volleyball Court'
];

const BookEventPage = () => {
  const [formData, setFormData] = useState({
    facility: facilities[0],
    purpose: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      toast.error('End Time must be after Start Time.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('/api/events/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        toast.success("Booking Request Submitted successfully!");
        setTimeout(() => {
          navigate('/app/student/events/requests');
        }, 1500);
      } else {
        toast.error(data.message || "Failed to submit booking request.");
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
          <p className="text-slate-500 mb-8 font-medium">Your facility booking is pending approval.</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-2xl rounded-bl-2xl border-l border-slate-200"
      style={{ boxShadow: "0 0 20px 0px rgba(59, 130, 246, 0.2)" }}
    >
      {/* Dynamic Light Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none -mb-20 -ml-20"></div>

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100 shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>Campus Facility Booking</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-slate-900">Book Facility</h1>
            <p className="text-slate-500 text-lg font-medium">Reserve a sport facility, auditorium, or hall for your event.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} ref={formRef} className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-8 lg:p-12 shadow-xl shadow-slate-200/40 backdrop-blur-xl relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Select Campus Facility</label>
              <div className="relative group">
                <select
                  name="facility"
                  value={formData.facility}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 group-hover:border-blue-300 rounded-2xl pl-5 pr-10 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 appearance-none text-sm font-bold shadow-sm"
                >
                  {facilities.map(fac => <option key={fac} value={fac}>{fac}</option>)}
                </select>
                <ChevronRight className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Date Required</label>
              <div className="relative flex items-center group">
                <Calendar className="w-4 h-4 absolute left-5 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 group-hover:border-blue-300 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 text-sm font-bold shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 md:col-span-2">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Start Time</label>
                <div className="relative flex items-center group">
                  <Clock className="w-4 h-4 absolute left-5 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                  <input
                    type="time"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 group-hover:border-blue-300 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 text-sm font-bold shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">End Time</label>
                <div className="relative flex items-center group">
                  <Clock className="w-4 h-4 absolute left-5 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                  <input
                    type="time"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 group-hover:border-blue-300 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 text-sm font-bold shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Event Details / Purpose</label>
              <textarea
                name="purpose"
                required
                value={formData.purpose}
                onChange={handleChange}
                rows="3"
                placeholder="Briefly describe the event or activity (e.g., Annual Sports Meet, Coding Bootcamp)..."
                className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 resize-none text-sm font-semibold shadow-sm leading-relaxed placeholder-slate-400"
              ></textarea>
            </div>

            <div className="md:col-span-2 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black tracking-wide py-5 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 uppercase text-sm"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>Submit Booking Request <ChevronRight className="w-5 h-5 ml-3" /></>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default BookEventPage;
