import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHostelDashboardStats } from '../../services/hostelService';
import { 
  Home, Users, Clock, AlertCircle, 
  ChevronRight, ArrowRight, Bed, PieChart, Activity, UserPlus, FileText
} from 'lucide-react';
import gsap from 'gsap';

const StatCard = ({ title, value, subtext, icon: Icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`stagger-item bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
    </div>
    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h3>
    <div className="flex items-baseline gap-2">
      <p className="text-3xl font-black text-gray-900">{value}</p>
      {subtext && <p className="text-xs font-bold text-gray-400">{subtext}</p>}
    </div>
  </div>
);

const HostelDashboardPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getHostelDashboardStats();
        setStats(res.data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-item'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading]);

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  if (error || !stats) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-8 rounded-3xl max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2">Dashboard Error</h2>
          <p className="font-medium mb-6">{error || 'Could not load dashboard data.'}</p>
          <button type="button" onClick={() => window.location.reload()} className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20" ref={containerRef}>
      <div className="stagger-item flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Hostel Operational Dashboard</h1>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Live Residency & Occupancy Tracking</p>
        </div>
        <div className="flex gap-3">
          <button type="button" 
            onClick={() => navigate('/app/hostel/applicants')}
            className="px-6 py-3 bg-brand-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <UserPlus className="w-4 h-4" /> Manage Applicants
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Vacancy" 
          value={stats.vacantBeds} 
          subtext={`of ${stats.totalCapacity} beds`}
          icon={Bed} 
          color="emerald" 
          onClick={() => navigate('/app/hostel/occupancy')}
        />
        <StatCard 
          title="Pending Apps" 
          value={stats.pendingApplications} 
          subtext="Action required"
          icon={Clock} 
          color="indigo" 
          onClick={() => navigate('/app/hostel/applicants')}
        />
        <StatCard 
          title="Maintenance" 
          value={stats.activeMaintenance} 
          subtext="Unresolved tasks"
          icon={Activity} 
          color="amber" 
          onClick={() => navigate('/app/hostel/maintenance')}
        />
        <StatCard 
          title="Complaints" 
          value={stats.activeComplaints} 
          subtext="Student feedback"
          icon={AlertCircle} 
          color="rose" 
          onClick={() => navigate('/app/hostel/complaints')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Occupancy Analytics Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="stagger-item bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-500" />
              Gender-wise Residency Distribution
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                {(stats.genderStats || []).map((item, idx) => {
                   const percentage = Math.round((item.occupied / item.capacity) * 100) || 0;
                   const colorClass = item._id === 'Boys' ? 'bg-blue-500' : 'bg-rose-500';
                   return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{item._id} Hostel</p>
                          <p className="font-black text-gray-900">{item.occupied} / {item.capacity} Occupied</p>
                        </div>
                        <p className="text-xl font-black text-gray-900">{percentage}%</p>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                   );
                })}
              </div>
              
              <div className="hidden md:flex justify-center">
                 {/* Visual representation of occupancy */}
                 <div className="relative w-48 h-48 border-[16px] border-indigo-50 rounded-full flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-3xl font-black text-indigo-600">{Math.round((stats.totalOccupied / stats.totalCapacity) * 100) || 0}%</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Overall<br/>Occupancy</p>
                    </div>
                    {/* SVG Progress Ring could go here for better visual */}
                 </div>
              </div>
            </div>
          </div>

          <div className="stagger-item bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Recent System Alerts
            </h2>
            <div className="space-y-4">
               {stats.pendingApplications > 0 && (
                 <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">New Applicant Waiting</p>
                            <p className="text-xs text-gray-500 font-medium">There are {stats.pendingApplications} pending hostel applications.</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => navigate('/app/hostel/applicants')} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Review</button>
                 </div>
               )}
               {stats.activeMaintenance > 5 && (
                 <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">Maintenance Backlog</p>
                            <p className="text-xs text-gray-500 font-medium">{stats.activeMaintenance} requests require assignment.</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => navigate('/app/hostel/maintenance')} className="text-xs font-black text-amber-600 uppercase tracking-widest hover:underline">Manage</button>
                 </div>
               )}
               <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">System Logs Healthy</p>
                            <p className="text-xs text-gray-500 font-medium">All occupancy updates were synchronized successfully.</p>
                        </div>
                    </div>
               </div>
            </div>
          </div>
        </div>

        {/* Quick Access Sidebar */}
        <div className="space-y-8">
          <div className="stagger-item bg-indigo-600 text-white rounded-3xl p-8 shadow-xl shadow-indigo-100">
            <h2 className="text-lg font-black mb-8">Operations Portal</h2>
            <div className="space-y-4">
               {[
                 { name: 'Room Allocation', path: '/app/hostel/allocation', icon: Bed },
                 { name: 'Check-in / Out', path: '/app/hostel/check-in-out', icon: Clock },
                 { name: 'Occupancy Flow', path: '/app/hostel/occupancy', icon: PieChart },
                 { name: 'Contact Log', path: '/app/hostel/dashboard', icon: Users },
               ].map((item, idx) => (
                 <button type="button" 
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-between hover:bg-white/20 transition-all group"
                 >
                    <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-indigo-200" />
                        <span className="text-sm font-bold">{item.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                 </button>
               ))}
            </div>
          </div>

          <div className="stagger-item bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shadow-sm">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-gray-900">Urgent Issues</h2>
             </div>
             {stats.activeComplaints > 0 ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 font-medium">There are <span className="font-black text-rose-600">{stats.activeComplaints} unresolved complaints</span> requiring attention.</p>
                    <button type="button" 
                        onClick={() => navigate('/app/hostel/complaints')}
                        className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all"
                    >
                        View Complaints
                    </button>
                </div>
             ) : (
                <p className="text-sm text-gray-400 font-medium italic">No active complaints at the moment.</p>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HostelDashboardPage;
