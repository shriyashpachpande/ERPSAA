import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, CheckCircle2 } from 'lucide-react';

const SyllabusProgressChart = ({ data = [] }) => {
  // Map incoming allocation data to chart format
  const chartData = data.map((item, index) => ({
    subject: item.subjectId?.subjectName || 'Unknown',
    progress: item.syllabusProgress || 0,
    color: ['#6366f1', '#818cf8', '#a78bfa', '#c084fc', '#fb7185', '#38bdf8'][index % 6]
  })).slice(0, 5); // Limit to top 5 for better UI

  const overallCompletion = chartData.length > 0 
    ? (chartData.reduce((acc, curr) => acc + curr.progress, 0) / chartData.length).toFixed(1) 
    : 0;

  return (
    <div className="glass-panel p-8 rounded-[3rem] border-white/60 shadow-2xl shadow-slate-200/40 flex flex-col h-full group overflow-hidden relative min-h-[400px]">
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="space-y-1">
           <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Syllabus Tracker <CheckCircle2 className="w-5 h-5 text-indigo-500" />
           </h3>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Curriculum Metrics</p>
        </div>
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
           <BookOpen className="w-6 h-6 text-primary-400" />
        </div>
      </div>

      <div className="relative z-10 flex-grow h-[240px] mt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2">
             <BookOpen className="w-12 h-12 opacity-20" />
             <p className="text-xs font-black uppercase tracking-widest">No Active Courses</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis 
                dataKey="subject" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }}
                width={100}
              />
              <Tooltip 
                 cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                 contentStyle={{ 
                  borderRadius: '20px', 
                  border: 'none', 
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value) => [`${value}%`, 'Progress']}
              />
              <Bar 
                dataKey="progress" 
                radius={[0, 10, 10, 0]} 
                barSize={20}
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="relative z-10 pt-6 border-t border-slate-100 flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase">Average Completion</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">{overallCompletion}%</span>
         </div>
         <div className="flex -space-x-2">
            {chartData.map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase">
                    C{i+1}
                </div>
            ))}
         </div>
      </div>

      {/* Decorative Layers */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-primary-500/10 transition-colors"></div>
    </div>
  );
};

export default SyllabusProgressChart;
