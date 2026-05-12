import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BookOpen, PieChart as PieIcon } from 'lucide-react';

const SubjectsDistributionChart = ({ value }) => {
  // Mock distribution data
  const data = [
    { name: 'Core Subjects', value: value > 0 ? Math.ceil(value * 0.6) : 0, color: '#2563eb' },
    { name: 'Electives', value: value > 1 ? Math.floor(value * 0.3) : 0, color: '#818cf8' },
    { name: 'Labs/Practicals', value: 1, color: '#34d399' },
  ];

  return (
    <div className="glass-panel p-8 rounded-[3rem] border-white/60 shadow-2xl shadow-slate-200/50 flex flex-col h-full group overflow-hidden relative">
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="space-y-1">
           <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Subject Mapping <PieIcon className="w-5 h-5 text-indigo-500" />
           </h3>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Departmental Curriculum</p>
        </div>
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
           <BookOpen className="w-6 h-6" />
        </div>
      </div>

      <div className="relative z-10 flex-grow h-[240px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip 
               contentStyle={{ 
                borderRadius: '20px', 
                border: 'none', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={10}
              dataKey="value"
              animationBegin={500}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="none"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.1))' }}
                />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              content={({ payload }) => (
                <div className="flex justify-center gap-4 pt-4">
                  {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label for 3D depth effect */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
           <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Mapped</span>
        </div>
      </div>

      {/* 3D Decorative Layers */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
    </div>
  );
};

export default SubjectsDistributionChart;
