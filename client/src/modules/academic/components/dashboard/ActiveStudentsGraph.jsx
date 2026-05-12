import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp } from 'lucide-react';

const ActiveStudentsGraph = ({ value }) => {
  // Mock trend data for visualization purposes
  const data = [
    { name: 'Mon', count: value > 0 ? value - 1 : 0 },
    { name: 'Tue', count: value },
    { name: 'Wed', count: value > 1 ? value - 1 : 0 },
    { name: 'Thu', count: value + 1 },
    { name: 'Fri', count: value },
    { name: 'Sat', count: value },
    { name: 'Sun', count: value },
  ];

  return (
    <div className="glass-panel p-8 rounded-[3rem] border-white/60 shadow-2xl shadow-slate-200/50 flex flex-col h-full group overflow-hidden relative">
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="space-y-1">
           <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Student Activity <TrendingUp className="w-5 h-5 text-emerald-500" />
           </h3>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time enrollment feed</p>
        </div>
        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
           <Users className="w-6 h-6" />
        </div>
      </div>

      <div className="relative z-10 flex-grow h-[200px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
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
            <YAxis hide domain={[0, 'auto']} />
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
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#2563eb" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative z-10 pt-6 border-t border-slate-100 flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase">Total Active</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
         </div>
         <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            +12.5% Growth
         </div>
      </div>

      {/* 3D Decorative Layers */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mb-32"></div>
    </div>
  );
};

export default ActiveStudentsGraph;
