import { useState, useEffect, useMemo, useRef } from 'react';
import {
  BarChart3, Calendar, Clock, BookOpen, CheckCircle, XCircle,
  ChevronRight, Activity, Download, List, History, ClipboardCheck,
  LayoutDashboard, UserCircle, MoreVertical, Filter
} from 'lucide-react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie
} from 'recharts';
import gsap from 'gsap';
import * as attendanceApi from '../services/attendanceApi';
import { toast } from 'react-hot-toast';

const StudentAttendancePage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const resp = await attendanceApi.getMyAttendanceStats();
      setStats(resp.data.data);
    } catch (error) {
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const barData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.subjectWise).map(([id, sub]) => ({
      name: sub.name.length > 10 ? sub.name.substring(0, 8) + '..' : sub.name,
      fullName: sub.name,
      percentage: parseFloat(sub.percentage) || 0
    }));
  }, [stats]);

  const barColors = ['#4F46E5', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#06B6D4'];

  const donutData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Present', value: stats.present, fill: '#4F46E5' },
      { name: 'Absent', value: stats.absent, fill: '#E2E8F0' }
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-gray-500 tracking-wider">Loading Attendance Data...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div ref={containerRef} className="min-h-screen space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 p-2 lg:p-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
              <Activity className="w-7 h-7" />
           </div>
           <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">My Attendance</h1>
              <p className="text-slate-500 text-sm font-medium tracking-wide">Academics / Performance Ledger</p>
           </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button type="button" className="flex-1 sm:flex-none p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-slate-600 mx-auto" />
          </button>
          <button type="button" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20">
            <Download className="w-4 h-4" /> Export Ledger
          </button>
        </div>
      </div>

      {/* Top Cards Row: Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Left: Overall Attendance Donut */}
        <div 
          style={{ animationDelay: '100ms' }}
          className="dashboard-card bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] flex flex-col items-center animate-in fade-in zoom-in-95 fill-mode-both duration-700"
        >
          <div className="w-full flex items-center justify-between mb-4 px-2">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Overall Attendance</h3>
            <MoreVertical className="w-4 h-4 text-slate-300 cursor-pointer" />
          </div>

          <div className="h-[220px] w-full relative mb-6">
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{stats.percentage}%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-2">Score</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 w-full gap-4 pt-6 border-t border-slate-100">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Present</p>
              <p className="text-xl font-black text-indigo-600">{stats.present}</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Absent</p>
              <p className="text-xl font-black text-rose-500">{stats.absent}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total</p>
              <p className="text-xl font-black text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Center: Subject Completion Progress */}
        <div 
          style={{ animationDelay: '200ms' }}
          className="dashboard-card bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] flex flex-col animate-in fade-in zoom-in-95 fill-mode-both duration-700"
        >
          <div className="w-full flex items-center justify-between mb-8 px-2">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject Analysis</h3>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 uppercase tracking-widest animate-pulse">Sync Active</span>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto max-h-[280px] pr-2 scrollbar-thin scrollbar-thumb-slate-100">
            {Object.entries(stats.subjectWise).map(([id, sub], barIdx) => (
              <div 
                key={id} 
                style={{ animationDelay: `${200 + (barIdx * 50)}ms` }}
                className="group space-y-3 animate-in fade-in slide-in-from-right-4 fill-mode-both"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{sub.name}</span>
                  <span className="text-[11px] font-black text-slate-900">{sub.percentage}%</span>
                </div>
                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.4)]"
                    style={{ width: `${sub.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Attendance Activity */}
        <div 
          style={{ animationDelay: '300ms' }}
          className="dashboard-card bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] flex flex-col md:col-span-2 lg:col-span-1 animate-in fade-in zoom-in-95 fill-mode-both duration-700"
        >
          <div className="w-full flex items-center justify-between mb-8 px-2">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity Feed</h3>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Real-time</span>
          </div>

          <div className="space-y-8 flex-1 overflow-y-auto max-h-[280px] pr-2 scrollbar-thin scrollbar-thumb-slate-100">
            {stats.history.slice(0, 5).map((log, logIdx) => (
              <div 
                key={logIdx} 
                style={{ animationDelay: `${300 + (logIdx * 70)}ms` }}
                className="flex gap-5 items-start relative pb-8 border-l-2 border-dashed border-slate-100 ml-3 pl-8 last:border-0 last:pb-0 group animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
              >
                <div className={`absolute left-[-11px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-md transition-transform group-hover:scale-125 ${log.status === 'Present' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-rose-500 shadow-rose-100'}`}></div>
                <div className="flex-1 -mt-1.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{log.subject.subjectName}</p>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${log.status === 'Present' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-rose-500 bg-rose-50 border-rose-100'}`}>{log.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                       <Clock className="w-3 h-3" /> {log.startTime}
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Calendar className="w-3 h-3" /> {new Date(log.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: History Table & Subject Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-8">

        {/* Bottom Left: Detailed Attendance Log Table (Wide) */}
        <div 
          style={{ animationDelay: '400ms' }}
          className="dashboard-card lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 fill-mode-both duration-700"
        >
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                 <History className="w-4 h-4" />
              </div>
              Detailed Records Log
            </h3>
            <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:text-indigo-700 transition-colors px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">View Archive</button>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-100">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Session Date</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Subject</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Timing</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.history.slice(0, 8).map((item, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    style={{ animationDelay: `${400 + (rowIdx * 40)}ms` }}
                    className="group hover:bg-slate-50/50 transition-colors animate-in fade-in slide-in-from-left-4 fill-mode-both"
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <p className="text-xs font-black text-slate-700">{new Date(item.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[250px]">{item.subject.subjectName}</p>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <Clock className="w-3 h-3" />
                        {item.startTime} - {item.endTime}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${item.status === 'Present' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-rose-50 text-rose-500 border-rose-100'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Right: Subject-wise Analysis Bar Chart */}
        <div 
          style={{ animationDelay: '500ms' }}
          className="dashboard-card bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] flex flex-col animate-in fade-in zoom-in-95 fill-mode-both duration-700"
        >
          <div className="w-full flex items-center justify-between mb-10 px-2">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Consistency Graph</h3>
            <BarChart3 className="w-4 h-4 text-slate-300" />
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: -10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: '900', fill: '#94a3b8', textAnchor: 'start', dx: -5 }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(79, 70, 229, 0.03)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                  labelStyle={{ fontSize: '10px', fontWeight: '900', color: '#1e293b', marginBottom: '4px', textTransform: 'uppercase' }}
                />
                <Bar dataKey="percentage" radius={[0, 8, 8, 0]} barSize={14}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-8 text-[9px] font-black text-slate-300 text-center uppercase tracking-[0.4em]">Academic Precision Metric</p>
        </div>

      </div>
    </div>
  );
};

export default StudentAttendancePage;
