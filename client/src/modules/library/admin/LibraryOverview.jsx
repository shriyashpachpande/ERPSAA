import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Book, Users, AlertCircle, TrendingUp } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LibraryOverview = () => {
    const { getStats, loading } = useLibrary();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getStats();
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) return <div className="p-10 text-center animate-pulse font-bold">Analysing Library Data...</div>;

    const data = [
        { name: 'Total Books', value: stats.totalBooks, color: '#4f46e5' },
        { name: 'Available', value: stats.availableCopies, color: '#10b981' },
        { name: 'Overdue', value: stats.overdueBooks, color: '#ef4444' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header>
                <div className="flex items-center gap-3 mb-1">
                    <LayoutDashboard className="w-5 h-5 text-primary-600" />
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Administrative Suite</span>
                </div>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight">Library Analytics</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Summary */}
                <div className="lg:col-span-2 glass-panel p-8">
                    <h3 className="text-lg font-bold text-brand-dark mb-8 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-3 text-primary-600" />
                        Collection Distribution
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#9ca3af' }} />
                                <Tooltip 
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 bg-brand-dark text-white border-none shadow-2xl">
                        <p className="text-xs font-black uppercase tracking-widest text-primary-400 mb-6">Critical Status</p>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="font-bold text-sm opacity-80">Overdue Items</span>
                                </div>
                                <span className="text-2xl font-black text-red-400">{stats.overdueBooks}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="font-bold text-sm opacity-80">Active Inventory</span>
                                </div>
                                <span className="text-2xl font-black text-emerald-400">{stats.availableCopies}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 flex flex-col items-center justify-center text-center py-10 opacity-60">
                         <AlertCircle className="w-8 h-8 text-gray-300 mb-3" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phase 2 Preview</p>
                         <p className="text-xs font-bold text-gray-400 mt-1">Audit Logs & Loss Prevention</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryOverview;
