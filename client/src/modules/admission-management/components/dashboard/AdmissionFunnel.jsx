import React from 'react';
import { ArrowRight } from 'lucide-react';

const AdmissionFunnel = ({ data }) => {
  if (!data || data.length === 0) return null;

  const total = data[0]?.count || 1;
  const lastStep = data[data.length - 1]?.count || 0;
  const overallConversion = ((lastStep / total) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Admission Funnel</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Conversion Pipeline</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
           <p className="text-[10px] font-black uppercase leading-none mb-1 text-center">{overallConversion}%</p>
           <p className="text-[9px] font-bold opacity-70 leading-none">Total Conv.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-2 justify-center py-2">
        {data.map((step, idx) => {
          // Dynamic width for funnel shape
          const width = 100 - (idx * 12);
          const nextStepCount = data[idx + 1]?.count || 0;
          const dropoff = idx < data.length - 1 ? (((step.count - nextStepCount) / (step.count || 1)) * 100).toFixed(0) : 0;
          
          return (
            <div key={idx} className="relative group/step">
              <div 
                className="h-12 rounded-2xl flex items-center px-4 text-white font-black text-xs shadow-md transition-all group-hover/step:scale-[1.02] relative overflow-hidden"
                style={{ 
                    width: `${width}%`, 
                    backgroundColor: step.color,
                    marginLeft: `${(100 - width) / 2}%`
                }}
              >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none"></div>
                
                <span className="truncate relative z-10">{step.stage}</span>
                <div className="ml-auto flex items-center space-x-2 relative z-10 font-black">
                   <span className="text-lg font-black">{step.count}</span>
                   <span className="text-[10px] opacity-70">
                     ({((step.count / total) * 100).toFixed(0)}%)
                   </span>
                </div>
              </div>
              
              {idx < data.length - 1 && (
                <div className="flex flex-col items-center my-1">
                   <div className="w-0.5 h-3 bg-gray-100 group-hover/step:bg-primary-200 transition-colors"></div>
                   <div className="bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                      <span className="text-[8px] font-black text-gray-400 uppercase">-{dropoff}% Dropoff</span>
                   </div>
                   <div className="w-0.5 h-3 bg-gray-100 group-hover/step:bg-primary-200 transition-colors"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center space-x-3 group-hover:bg-indigo-50 transition-colors">
        <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
           <ArrowRight className="w-4 h-4 rotate-90" />
        </div>
        <div>
           <p className="text-[10px] font-black text-indigo-900 uppercase tracking-tight">Optimization Tip</p>
           <p className="text-[11px] text-indigo-700 font-medium leading-tight">Focus on converting 'Started' to 'Submitted' this week.</p>
        </div>
      </div>
    </div>
  );
};

export default AdmissionFunnel;
