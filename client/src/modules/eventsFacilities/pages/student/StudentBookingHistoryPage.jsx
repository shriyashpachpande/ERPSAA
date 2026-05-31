import React, { useState, useEffect } from 'react';
import { History, Calendar, Clock, Search, AlertCircle, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500', Icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-rose-100 text-rose-700 border-rose-200', bar: 'bg-rose-500', Icon: XCircle },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-700 border-slate-200', bar: 'bg-slate-400', Icon: XCircle },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-400', Icon: Hourglass },
};

const StudentBookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/eventsFacilities/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setBookings(data.data);
        else toast.error('Failed to load booking history.');
      } catch {
        toast.error('Network error.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = bookings.filter(b => {
    const matchesSearch =
      b.facilityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-2xl border-l border-slate-200">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-300/10 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-violet-100 shadow-sm">
              <History className="w-3.5 h-3.5" />
              <span>All Activity</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">Booking History</h1>
            <p className="text-slate-500 text-lg font-medium">A full record of every facility booking you have ever submitted.</p>
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search facility or purpose..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-full pl-12 pr-6 py-3 w-full md:w-72 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium text-sm shadow-sm"
            />
          </div>
        </header>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected', 'cancelled'].map(s => (
            <button type="button"
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all border ${statusFilter === s
                  ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-600'
                }`}
            >
              {s === 'all' ? 'All Requests' : s}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-16 text-center shadow-lg">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-bold text-slate-700">No records found</h3>
            <p className="mt-2 text-sm text-slate-400">
              {statusFilter === 'all' ? "You haven't submitted any booking requests yet." : `No ${statusFilter} requests.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(booking => {
              const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
              const { Icon } = cfg;
              return (
                <div
                  key={booking._id}
                  className="bg-white border border-slate-200 hover:border-violet-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all relative flex flex-col"
                >
                  {/* coloured top bar */}
                  <div className={`w-full h-1 ${cfg.bar}`} />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                      <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {String(booking.categorySlug || '').replace(/-/g, ' ')}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-1">{booking.facilityName}</h3>
                    <p className="text-sm font-medium text-slate-500 line-clamp-2 min-h-[40px] mb-4">{booking.purpose}</p>

                    <div className="mt-auto space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center text-sm font-bold text-slate-700">
                        <Calendar className="w-4 h-4 text-violet-500 mr-3" />
                        {new Date(booking.date).toLocaleDateString('en-GB', {
                          weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-sm font-bold text-slate-700">
                        <Clock className="w-4 h-4 text-violet-500 mr-3" />
                        {booking.startTime} – {booking.endTime}
                      </div>
                    </div>

                    {booking.reviewNote && (
                      <p className="mt-3 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                        Note: {booking.reviewNote}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary bar */}
        {!loading && bookings.length > 0 && (
          <p className="text-center text-xs text-slate-400 font-medium pt-4">
            Showing {filtered.length} of {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>
    </div>
  );
};

export default StudentBookingHistoryPage;
