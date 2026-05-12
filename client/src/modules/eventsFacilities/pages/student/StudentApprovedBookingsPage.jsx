import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Clock, Search, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentApprovedBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApproved();
  }, []);

  const fetchApproved = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/eventsFacilities/bookings/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // Filter only approved ones
        setBookings(data.data.filter(b => b.status === 'approved'));
      } else {
        toast.error('Failed to load approved bookings.');
      }
    } catch (err) {
      toast.error('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter(b =>
    b.facilityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-2xl border-l border-slate-200">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-300/10 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-emerald-100 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approved Bookings</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-slate-900">My Approved Bookings</h1>
            <p className="text-slate-500 text-lg font-medium">All confirmed facility reservations authorised by the administration.</p>
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search facility or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-full pl-12 pr-6 py-3 w-full md:w-80 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm shadow-sm"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-16 text-center shadow-lg">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-bold text-slate-700">No approved bookings yet</h3>
            <p className="mt-2 text-sm text-slate-400">Once your booking request gets approved, it will show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(booking => (
              <div key={booking._id} className="bg-white border border-emerald-200 hover:border-emerald-400 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all relative overflow-hidden flex flex-col">
                
                {/* Green top bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3" /> Approved
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    {String(booking.categorySlug || '').replace(/-/g, ' ')}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-1">{booking.facilityName}</h3>
                <p className="text-sm font-medium text-slate-500 line-clamp-2 min-h-[40px] mb-4">{booking.purpose}</p>

                <div className="mt-auto space-y-2 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center text-sm font-bold text-slate-700">
                    <Calendar className="w-4 h-4 text-emerald-500 mr-3" />
                    {new Date(booking.date).toLocaleDateString('en-GB', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-sm font-bold text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-500 mr-3" />
                    {booking.startTime} – {booking.endTime}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentApprovedBookingsPage;
