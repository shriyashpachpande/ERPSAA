import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  submitted: '#3b82f6',
  under_review: '#f59e0b',
  reupload_requested: '#ef4444',
  approved: '#10b981',
  rejected: '#6366f1',
  draft: '#94a3b8',
  pending_clarification: '#8b5cf6'
};

const StatusOverview = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="h-[300px] flex items-center justify-center text-gray-400 font-medium">
      No data available
    </div>
  );

  const chartData = data.map(item => ({
    name: (item.status || 'unknown').replace('_', ' ').toUpperCase(),
    value: item.count || 0,
    color: COLORS[item.status] || '#CBD5E1'
  }));

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col relative group">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Application Status</h3>
        <div className="p-1.5 bg-gray-50 rounded-lg">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-6 font-medium uppercase tracking-wider">Live Distribution</p>
      
      <div className="flex-1 w-full relative" style={{ minHeight: '250px' }}>
        {/* Total Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
           <p className="text-2xl font-black text-gray-900 leading-none">
             {chartData.reduce((acc, curr) => acc + curr.value, 0)}
           </p>
        </div>

        <ResponsiveContainer width="99%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="none"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-50 animate-in zoom-in duration-200">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{payload[0].name}</p>
                      <p className="text-sm font-black text-gray-900">{payload[0].value} Applications</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 pb-2">
        {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2 bg-gray-50/50 p-2 rounded-xl border border-transparent hover:border-gray-100 transition-colors">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase truncate">{item.name}</span>
                  <span className="text-xs font-black text-gray-900">{item.value}</span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default StatusOverview;
