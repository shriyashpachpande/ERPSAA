import { useMemo } from 'react';
import { 
  Users, BookOpen, GraduationCap, Building2, 
  TrendingUp, PieChart, BarChart3, Activity, 
  ArrowUpRight, Target, ShieldCheck, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const AcademicAdminDashboard = ({ stats, loading }) => {
  // Mock data for visualizations (In a real scenario, these would come from an expanded dashboardApi)
  const enrollmentData = [
    { name: '2021', value: 400 },
    { name: '2022', value: 600 },
    { name: '2023', value: 850 },
    { name: '2024', value: 1100 },
    { name: '2025', value: 1450 },
  ];

  const deptData = [
    { name: 'CS', students: 400, faculty: 24 },
    { name: 'IT', students: 300, faculty: 18 },
    { name: 'ME', students: 250, faculty: 15 },
    { name: 'ECT', students: 200, faculty: 12 },
    { name: 'CE', students: 150, faculty: 10 },
  ];

  const allocationData = [
    { name: 'Allocated', value: 75, color: '#6366f1' },
    { name: 'Pending', value: 25, color: '#f43f5e' },
  ];

  if (loading) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* High-Impact Stat Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Enrollment', value: '1,450', sub: '+12% Growth', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Faculty', value: '79', sub: 'Across 5 Depts', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Courses Offered', value: '124', sub: 'Current Semester', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Avg Attendance', value: '88.4%', sub: 'Real-time Sync', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-[2.5rem] bg-white/60 border-white/80 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-slate-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary-500/10 transition-colors"></div>
             <div className="flex items-start justify-between relative z-10">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                   <TrendingUp className="w-3 h-3" /> {stat.sub}
                </div>
             </div>
             <div className="mt-6 relative z-10">
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Analytics */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-[3rem] bg-white border-white/60 shadow-xl relative overflow-hidden group">
           <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="space-y-1">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                   Growth Intelligence <Zap className="w-5 h-5 text-amber-500" />
                 </h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enrollment progression over time</p>
              </div>
              <div className="flex gap-2">
                 {['YTD', 'ALL'].map(t => <button type="button" key={t} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${t === 'ALL' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{t}</button>)}
              </div>
           </div>

           <div className="h-[300px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={enrollmentData}>
                    <defs>
                       <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                    <YAxis hide domain={[0, 'dataMax + 200']} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Resource Distribution */}
        <div className="glass-panel p-8 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 mb-8">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                 Asset Allocation <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Faculty Assignment Status</p>
           </div>

           <div className="h-[240px] w-full relative z-10 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <RePieChart>
                    <Pie
                       data={allocationData}
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={10}
                       dataKey="value"
                    >
                       {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </RePieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-black">75%</span>
                 <span className="text-[8px] font-black text-slate-500 uppercase">Synchronized</span>
              </div>
           </div>

           <div className="mt-8 space-y-4 relative z-10">
              {allocationData.map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                       <span className="text-xs font-bold text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-black">{item.value}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Departmental Intelligence Matrix */}
      <div className="glass-panel p-10 rounded-[3.5rem] bg-white border-white/60 shadow-xl overflow-hidden relative group">
         <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  Departmental Matrix <Building2 className="w-6 h-6 text-indigo-600" />
               </h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resource distribution per academic unit</p>
            </div>
            <button type="button" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
               Download Audit <ArrowUpRight className="w-4 h-4" />
            </button>
         </div>

         <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={deptData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip 
                     cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                     contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 60px rgba(0,0,0,0.15)', padding: '15px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                  <Bar dataKey="students" name="Total Students" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                  <Bar dataKey="faculty" name="Staff Strength" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} />
               </BarChart>
            </ResponsiveContainer>
         </div>

         {/* Decorative Watermark */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none rotate-12">
            <Target className="w-[500px] h-[500px]" />
         </div>
      </div>
    </div>
  );
};

export default AcademicAdminDashboard;
