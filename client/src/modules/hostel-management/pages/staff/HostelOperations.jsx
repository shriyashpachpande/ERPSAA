import React, { useState, useEffect } from 'react';
import { 
  getAllComplaints, 
  updateComplaintStatus,
  getAllMaintenanceRequests,
  updateMaintenanceRequestStatus,
  getHostelsSummary,
  getHostelOccupancy,
  checkInStudent,
  checkOutStudent,
  getCheckInOutStats,
  getStudentHostelProfile
} from '../../services/hostelService';
import { 
  MessageSquare, Wrench, ShieldAlert, PieChart, 
  DoorOpen, DoorClosed, LayoutGrid, Info, Check, 
  Clock, AlertCircle, X, Search, Calendar, User, 
  MapPin, Hash, Layers, Home, ArrowRight, Phone, HeartPulse, Users
} from 'lucide-react';
import gsap from 'gsap';

// ===============================================
// SHARED COMPONENTS
// ===============================================
const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
    'In-Progress': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Closed': 'bg-gray-50 text-gray-500 border-gray-100'
  };
  return (
    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
};

// ===============================================
// 1. OCCUPANCY ANALYTICS PAGE
// ===============================================
export const OccupancyAnalyticsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHostelsSummary().then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center font-bold">Loading Stats...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Occupancy Analytics</h1>
        <p className="text-gray-500 font-medium">Real-time capacity and vacancy distribution across hostels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map(hostel => {
          const occupancyRate = hostel.capacity > 0 ? Math.round((hostel.occupied / hostel.capacity) * 100) : 0;
          return (
            <div key={hostel._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{hostel.name}</h3>
                    <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">{hostel.type} Hostel</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-gray-900">{occupancyRate}%</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Occupied</p>
                  </div>
               </div>
               
               <div className="space-y-4 mb-8">
                  <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${hostel.type === 'Boys' ? 'bg-blue-500' : 'bg-rose-500'}`} 
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-400 font-mono">
                    <span>{hostel.occupied} BEDS OCCUPIED</span>
                    <span>CAPACITY: {hostel.capacity}</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Available</p>
                    <p className="text-xl font-black text-emerald-700">{hostel.capacity - hostel.occupied}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Occupied</p>
                    <p className="text-xl font-black text-indigo-700">{hostel.occupied}</p>
                  </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===============================================
// 2. CHECK-IN / CHECK-OUT PAGE (REDESIGNED)
// ===============================================
export const CheckInCheckOutPage = () => {
  const [mode, setMode] = useState('Check-In');
  const [searchId, setSearchId] = useState('');
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    pendingCheckIns: 0,
    activeResidents: 0,
    pendingCheckOuts: 0,
    totalAllocations: 0
  });
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  // Fetch KPIs on load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getCheckInOutStats();
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch check-in stats');
      }
    };
    fetchStats();
  }, []);

  // Handle Search
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchId.trim()) return;
    
    setSearching(true);
    setProfile(null);
    setError('');
    
    try {
      const res = await getStudentHostelProfile(searchId);
      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Student profile not found or no active allocation.');
    } finally {
      setSearching(false);
    }
  };

  // Handle Action
  const handleOperation = async () => {
    setSubmitting(true);
    try {
      if (mode === 'Check-In') {
        await checkInStudent({ studentId: profile.student.studentId, remarks });
      } else {
        await checkOutStudent({ studentId: profile.student.studentId, remarks });
      }
      
      // Refresh profile after success
      const updated = await getStudentHostelProfile(searchId);
      setProfile(updated.data);
      setRemarks('');
      alert(`${mode} successful!`);
      
      // Update stats
      const s = await getCheckInOutStats();
      setStats(s.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Animations
  useEffect(() => {
    gsap.fromTo('.stagger-op', 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-10">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 stagger-op">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Student Check-In / Out</h1>
          <p className="text-gray-500 font-medium">Manage resident entry, exit, and stay verification</p>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="hidden lg:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Date</p>
            <p className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button type="button" 
            onClick={() => window.location.reload()}
            className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-indigo-600 transition-all shadow-sm"
          >
            <Clock className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. KPI STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-op">
        {[
          { label: 'Pending Check-Ins', value: stats.pendingCheckIns, color: 'indigo', icon: DoorOpen },
          { label: 'Active Residents', value: stats.activeResidents, color: 'emerald', icon: Check },
          { label: 'Pending Check-Outs', value: stats.pendingCheckOuts, color: 'amber', icon: Clock },
          { label: 'Total Allocations', value: stats.totalAllocations, color: 'sky', icon: LayoutGrid },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl`}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{kpi.label}</p>
              <p className="text-xl font-black text-gray-800">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. MODE & SEARCH BAR */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm stagger-op">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4">
            <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
              {['Check-In', 'Check-Out'].map(t => (
                <button type="button"
                  key={t}
                  onClick={() => { setMode(t); if(profile) setProfile(null); }}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    mode === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t === 'Check-In' ? <DoorOpen className="w-4 h-4" /> : <DoorClosed className="w-4 h-4" />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="lg:col-span-8 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={`Search by Student ID (e.g. STU-2026-0001)...`}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 outline-none transition-all placeholder:text-gray-300"
              />
            </div>
            <button 
              type="submit"
              disabled={searching}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
            >
              {searching ? 'Searching...' : 'Lookup'}
            </button>
          </form>
        </div>
      </div>

      {/* 4. CONTENT AREA (PROFILE + ACTION) */}
      {!profile ? (
        <div className="stagger-op py-20 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-[3rem]">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            {error ? 'Search Result' : 'Operational Lookup'}
          </h2>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            {error || `Enter a student identifier above to manage their ${mode} status and verify stay details.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 stagger-op">
          {/* PROFILE CARD */}
          <div className="lg:col-span-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 bg-indigo-600 text-white flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center text-white backdrop-blur-md">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black">{profile.student.personalDetails.fullName}</h2>
                <p className="text-indigo-200 font-bold uppercase tracking-widest text-[10px]">
                  {profile.student.studentId} • {profile.student.academicProfile.course} ({profile.student.academicProfile.batch})
                </p>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-3 h-3" /> Allocation Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Home className="w-4 h-4" /></div>
                    <p className="text-sm font-bold text-gray-700">{profile.allocation?.hostelId?.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-xl"><MapPin className="w-4 h-4" /></div>
                    <p className="text-sm font-bold text-gray-700">{profile.allocation?.blockId?.name} • {profile.allocation?.floorId?.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Hash className="w-4 h-4" /></div>
                    <p className="text-sm font-bold text-gray-700">Room {profile.allocation?.roomId?.roomNumber} • Bed {profile.allocation?.bedId?.bedNumber}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Stay Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      profile.student.modules?.hostel?.status === 'checked_in' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {profile.student.modules?.hostel?.status?.replace('_', ' ') || 'Allocated'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Log</p>
                    <p className="text-xs font-bold text-gray-600">
                      {profile.logs?.[0] ? `${profile.logs[0].type} on ${new Date(profile.logs[0].createdAt).toLocaleDateString()}` : 'No manual logs yet'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Allocation Date: {new Date(profile.allocation.createdAt).toLocaleDateString()}</p>
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                <Check className="w-3 h-3" /> Records Verified
              </div>
            </div>
          </div>

          {/* ACTION PANEL */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex-1">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                {mode === 'Check-In' ? <DoorOpen className="w-6 h-6 text-emerald-500" /> : <DoorClosed className="w-6 h-6 text-rose-500" />}
                Confirm {mode}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Remarks / Notes</label>
                  <textarea 
                    rows="4"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder={`Enter any internal notes for this ${mode.toLowerCase()}...`}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm text-gray-800 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  ></textarea>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Operational Preview</p>
                  <ul className="text-[11px] font-bold text-amber-700/80 space-y-1">
                    {mode === 'Check-In' ? (
                      <>
                        <li className="flex items-center gap-2"><Check className="w-3 h-3" /> Update module status to 'Checked-In'</li>
                        <li className="flex items-center gap-2"><Check className="w-3 h-3" /> Generate entry timestamp log</li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2"><Check className="w-3 h-3" /> Update module status to 'Checked-Out'</li>
                        <li className="flex items-center gap-2"><Check className="w-3 h-3" /> Record exit reason & timestamp</li>
                      </>
                    )}
                  </ul>
                </div>

                <button type="button" 
                  onClick={handleOperation}
                  disabled={submitting || (mode === 'Check-In' && profile.student.modules?.hostel?.status === 'checked_in') || (mode === 'Check-Out' && profile.student.modules?.hostel?.status !== 'checked_in')}
                  className={`w-full py-5 rounded-2xl font-black text-white uppercase tracking-widest text-xs shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale ${
                    mode === 'Check-In' ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-100 hover:bg-rose-700'
                  }`}
                >
                  {submitting ? 'Processing...' : (
                    mode === 'Check-In' && profile.student.modules?.hostel?.status === 'checked_in' ? 'Already Checked-In' :
                    mode === 'Check-Out' && profile.student.modules?.hostel?.status === 'checked_out' ? 'Already Checked-Out' :
                    `Confirm ${mode}`
                  )}
                </button>
              </div>
            </div>

            {/* TIMELINE MINI CARD */}
            <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-indigo-400">
                <Clock className="w-4 h-4" /> Activity Feed
              </h3>
              <div className="space-y-6">
                {profile.logs.length === 0 ? (
                  <p className="text-xs font-bold text-gray-500 italic">No operational history found.</p>
                ) : profile.logs.slice(0, 3).map((log, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.type === 'Check-In' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">{log.type}</p>
                      <p className="text-[10px] text-gray-500 font-bold">{new Date(log.createdAt).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 mt-1 italic leading-tight">"{log.remarks}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===============================================
// 3. STAFF COMPLAINTS PAGE
// ===============================================
export const HostelStaffComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState('');

  const fetchComplaints = () => {
    getAllComplaints().then(res => {
      setComplaints(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdate = async (status) => {
    try {
      await updateComplaintStatus(selected._id, { status, adminRemarks: remarks });
      setSelected(null);
      setRemarks('');
      fetchComplaints();
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center font-bold">Loading Complaints...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Grievance Management</h1>
        <p className="text-gray-500 font-medium">{complaints.length} active complaints from residents.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {complaints.map(c => (
          <div key={c._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                  {c.studentId?.personalDetails?.fullName?.charAt(0)}
                </div>
                <div>
                   <h3 className="font-black text-gray-900">{c.subject}</h3>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{c.studentId?.personalDetails?.fullName} • {c.category}</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <StatusBadge status={c.status} />
                <button type="button" 
                  onClick={() => setSelected(c)}
                  className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
             </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 overflow-hidden relative">
              <button type="button" 
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-2xl font-black text-gray-900 mb-2">{selected.subject}</h2>
              <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-8">{selected.category}</p>
              
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8">
                 <p className="text-sm text-gray-600 leading-relaxed font-medium">{selected.description}</p>
              </div>

              <textarea 
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Action taken / Remarks..."
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl mb-8 font-bold text-gray-800 outline-none"
              ></textarea>

              <div className="grid grid-cols-2 gap-4">
                 <button type="button" onClick={() => handleUpdate('Resolved')} className="py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700">Mark Resolved</button>
                 <button type="button" onClick={() => handleUpdate('In-Progress')} className="py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700">In Progress</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// ===============================================
// 4. MAINTENANCE REQUESTS PAGE
// ===============================================
export const MaintenanceRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState('');

  const fetchRequests = () => {
    getAllMaintenanceRequests().then(res => {
      setRequests(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdate = async (status) => {
    try {
      await updateMaintenanceRequestStatus(selected._id, { status, adminRemarks: remarks });
      setSelected(null);
      setRemarks('');
      fetchRequests();
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center font-bold">Loading Requests...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Maintenance Pipeline</h1>
        <p className="text-gray-500 font-medium">Repair and facility management for hostel rooms.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.map(r => (
          <div key={r._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-black text-gray-900">{r.issueType}</h3>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{r.location} • {r.status}</p>
                </div>
             </div>
             <button type="button" 
              onClick={() => setSelected(r)}
              className="px-6 py-3 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
             >
                Process
             </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 relative">
              <button type="button" 
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-2xl font-black text-gray-900 mb-8">{selected.issueType} - <span className="text-indigo-600">{selected.location}</span></h2>

              <div className="p-6 bg-gray-50 rounded-2xl mb-8">
                 <p className="text-sm font-bold text-gray-600 italic">"{selected.description}"</p>
              </div>

              <textarea 
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Maintenance update / Remarks..."
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl mb-8 font-bold text-gray-800 outline-none"
              ></textarea>

              <div className="grid grid-cols-2 gap-4">
                 <button type="button" onClick={() => handleUpdate('Resolved')} className="py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100">Task Completed</button>
                 <button type="button" onClick={() => handleUpdate('In-Progress')} className="py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100">In Progress</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// ===============================================
// 5. ROOM & BED DETAILS PAGE (STAFF)
// ===============================================
export const RoomDetailsPage = () => {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [occupancy, setOccupancy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHostelsSummary().then(res => {
      setHostels(res.data);
      setLoading(false);
    });
  }, []);

  const handleSelectHostel = async (h) => {
    setSelectedHostel(h);
    setLoading(true);
    try {
      const res = await getHostelOccupancy(h._id);
      setOccupancy(res.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedHostel) return <div className="h-96 flex items-center justify-center font-bold">Loading Hostels...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Room Inventory</h1>
          <p className="text-gray-500 font-medium">Detailed layout of blocks, floors and beds.</p>
        </div>
        {selectedHostel && (
          <button type="button" 
            onClick={() => { setSelectedHostel(null); setOccupancy(null); }}
            className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
          >
            Switch Hostel
          </button>
        )}
      </div>

      {!selectedHostel ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map(h => (
            <div 
              key={h._id} 
              onClick={() => handleSelectHostel(h)}
              className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:border-indigo-500 transition-all cursor-pointer group"
            >
               <Home className="w-12 h-12 text-indigo-600 mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-2xl font-black text-gray-900">{h.name}</h3>
               <p className="text-xs font-black text-indigo-400 tracking-widest uppercase mb-6">{h.type}</p>
               <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <p className="text-sm font-bold text-gray-400">{h.capacity} Total Beds</p>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
           {loading ? <div className="p-20 text-center font-bold">Loading Occupancy...</div> : (
              occupancy?.blocks.map(block => (
                <div key={block._id} className="space-y-6">
                   <h2 className="text-xl font-black text-gray-900 px-4 flex items-center gap-2">
                     <LayoutGrid className="w-5 h-5 text-indigo-500" />
                     {block.name}
                   </h2>
                   {block.floors.map(floor => (
                     <div key={floor._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-50 pb-4">{floor.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                           {floor.rooms.map(room => (
                             <div key={room._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs font-black text-gray-900 mb-3">{room.roomNumber}</p>
                                <div className="flex gap-1.5 flex-wrap">
                                   {room.beds.map(bed => (
                                     <div 
                                      key={bed._id}
                                      className={`w-4 h-4 rounded-md ${bed.status === 'Occupied' ? 'bg-rose-400' : 'bg-emerald-400'}`}
                                      title={`Bed ${bed.bedNumber} - ${bed.status}`}
                                     ></div>
                                   ))}
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
              ))
           )}
        </div>
      )}
    </div>
  );
};

// ===============================================
// 6. EMERGENCY CONTACTS PAGE (STAFF)
// ===============================================
export const EmergencyContactsPage = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Institutional Contacts</h1>
        <p className="text-gray-500 font-medium">Internal emergency numbers and warden staff directory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <h2 className="text-xl font-black mb-10 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              Emergency Response
            </h2>
            <div className="space-y-8">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-rose-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Campus Security</p>
                    <p className="text-2xl font-black">911 / +91 000 000 0000</p>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Medical Cell</p>
                    <p className="text-2xl font-black">101 / +91 000 000 0001</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-10 flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-500" />
              Hostel Wardens
            </h2>
            <div className="space-y-6">
               {[
                 { name: 'Dr. Sameer Khan', role: 'Chief Warden (Boys)', phone: '0300 0000000' },
                 { name: 'Dr. Aisha Ahmed', role: 'Chief Warden (Girls)', phone: '0301 0000000' },
                 { name: 'Mr. John Wick', role: 'Security Incharge', phone: '0302 0000000' },
               ].map((w, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-sm font-black text-gray-900">{w.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{w.role}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-indigo-600">{w.phone}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
