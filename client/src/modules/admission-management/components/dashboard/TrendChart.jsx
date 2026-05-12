import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="h-[300px] flex items-center justify-center text-gray-400 font-medium">
      No trend data available
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Application Trends</h3>
          <p className="text-xs text-gray-500">Last 7 days performance</p>
        </div>
        <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Submitted</span>
            </div>
            <div className="flex items-center space-x-1 px-3">
                <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Approved</span>
            </div>
        </div>
      </div>

      <div className="flex-1 w-full" style={{ minHeight: '250px' }}>
        <ResponsiveContainer width="99%" height={250}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-50 animate-in slide-in-from-top-2 duration-200">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">{label}</p>
                      <div className="space-y-2">
                        {payload.map((p, i) => (
                          <div key={i} className="flex items-center justify-between space-x-8">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke }}></div>
                              <span className="text-xs font-bold text-gray-600 capitalize">{p.dataKey}</span>
                            </div>
                            <span className="text-xs font-black text-gray-900">{p.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="submitted" 
              stroke="#3b82f6" 
              strokeWidth={4}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              fillOpacity={1} 
              fill="url(#colorSub)" 
            />
            <Area 
              type="monotone" 
              dataKey="approved" 
              stroke="#10b981" 
              strokeWidth={4}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              fillOpacity={1} 
              fill="url(#colorApp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
