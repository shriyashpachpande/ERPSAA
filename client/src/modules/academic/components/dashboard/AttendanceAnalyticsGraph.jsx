import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

const AttendanceAnalyticsGraph = () => {
  // Mock weekly attendance data for visualization
  const data = [
    { name: 'Mon', percentage: 85 },
    { name: 'Tue', percentage: 92 },
    { name: 'Wed', percentage: 88 },
    { name: 'Thu', percentage: 95 },
    { name: 'Fri', percentage: 82 },
    { name: 'Sat', percentage: 78 },
    { name: 'Sun', percentage: 85 },
  ];

  return (
    <div className="glass-panel p-8 rounded-[3rem] border-white/60 shadow-2xl shadow-slate-200/50 flex flex-col h-full group overflow-hidden relative">
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="space-y-1">
           <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Attendance Analytics <TrendingUp className="w-5 h-5 text-emerald-500" />
           </h3>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly Presence Ratio</p>
        </div>
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
           <Calendar className="w-6 h-6" />
        </div>
      </div>

      <div className="relative z-10 flex-grow h-[200px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }}
              dy={10}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '20px', 
                border: 'none', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                padding: '15px'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: '900', color: '#0f172a' }}
              formatter={(value) => [`${value}%`, 'Attendance']}
            />
            <Area 
              type="monotone" 
              dataKey="percentage" 
              stroke="#10b981" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorAttendance)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative z-10 pt-6 border-t border-slate-100 flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase">Average Presence</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">87.8%</span>
         </div>
         <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            +4.2% vs Last Week
         </div>
      </div>

      {/* 3D Decorative Layers */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mb-32"></div>
    </div>
  );
};

export default AttendanceAnalyticsGraph;
