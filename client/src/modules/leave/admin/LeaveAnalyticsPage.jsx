import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, Briefcase, AlertTriangle, CheckCircle, BarChart3, TrendingUp, XCircle } from 'lucide-react';
import gsap from 'gsap';
import toast from 'react-hot-toast';

const LeaveAnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/leave/analytics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setAnalytics(data.data);
                } else {
                    toast.error(data.error || 'Failed to fetch analytics.');
                }
            } catch (err) {
                toast.error('Network Error');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    useEffect(() => {
        if (!loading && analytics) {
            gsap.fromTo('.animate-section',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [loading, analytics]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-[#0f172a]">
                <Activity className="w-12 h-12 animate-spin text-primary-500" />
            </div>
        );
    }

    if (!analytics) return null;

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    const pieData = Object.entries(analytics.byType).map(([name, value]) => ({ name, value }));
    const barData = [
        { name: 'Pending', count: analytics.pending, fill: '#f59e0b' },
        { name: 'Approved', count: analytics.approved, fill: '#10b981' },
        { name: 'Rejected', count: analytics.rejected, fill: '#ef4444' }
    ];

    return (
        <div className="min-h-screen p-6 lg:p-10 text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10 animate-section">
                    <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-100 dark:bg-white/10 text-primary-700 dark:text-white rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-primary-200 dark:border-white/20">
                            <BarChart3 className="w-4 h-4" />
                            <span>Analytics Hub</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-slate-900 dark:text-white">Leave Analytics</h1>
                        <p className="text-slate-500 dark:text-gray-400 text-lg font-light">Comprehensive insights into department leave trends and patterns.</p>
                    </div>
                </header>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-section">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full -mr-10 -mt-10"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Volume</span>
                        </div>
                        <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-1">{analytics.totalRequests}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Requests Processed</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full -mr-10 -mt-10"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Yield</span>
                        </div>
                        <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-1">{analytics.approved}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Approved Leaves</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-2xl rounded-full -mr-10 -mt-10"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <XCircle className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rejections</span>
                        </div>
                        <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-1">{analytics.rejected}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Declined Leaves</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(239,68,68,0.1)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-2xl rounded-full -mr-10 -mt-10"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Warnings</span>
                        </div>
                        <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-1">{analytics.flagged}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400 border-b border-red-500/20 pb-1 mb-1 inline-block">Flagged Patterns</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-section">
                    
                    {/* Pie Chart: Leave Types */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-blue-500">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Leave Spread</h3>
                                <p className="text-xs text-slate-400 font-medium">Distribution by Category</p>
                            </div>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart: Status Outcomes */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-emerald-50 dark:bg-white/5 rounded-lg text-emerald-500">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Status Metrics</h3>
                                <p className="text-xs text-slate-400 font-medium">Outcome Distribution</p>
                            </div>
                        </div>
                        <div className="h-72 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} maxBarSize={50}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
                                    />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LeaveAnalyticsPage;
