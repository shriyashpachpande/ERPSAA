import React, { useEffect, useState } from 'react';
import {
    Book, CheckCircle, Clock, AlertTriangle, ArrowUpRight, ArrowDownLeft,
    TrendingUp, TrendingDown, Users, BookOpen, Activity, AlertCircle, Check, X
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import useLibrary from '../hooks/useLibrary';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const LibraryDashboard = () => {
    const navigate = useNavigate();
    const { getStats, loading, reviewIssueRequest } = useLibrary();
    const [stats, setStats] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await getStats();
            setStats(res?.data || res || {});
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (!stats) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(".dash-card",
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.8,
                    ease: "power3.out",
                    clearProps: "all"
                }
            );
        });
        return () => ctx.revert();
    }, [stats]);

    const handleQuickApprove = async (id) => {
        setActionLoading(id);
        try {
            await reviewIssueRequest(id, { status: 'APPROVED' });
            await fetchStats();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && !stats) {
        return (
            <div className="p-8 space-y-10 animate-pulse">
                <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl"></div>)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-[400px] bg-gray-100 rounded-3xl"></div>
                    <div className="h-[400px] bg-gray-100 rounded-3xl"></div>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        { label: 'Total Books', value: stats?.totalBooks || 0, icon: Book, color: 'indigo', trend: '+12%', up: true },
        { label: 'Available', value: stats?.availableCopies || 0, icon: CheckCircle, color: 'emerald', trend: 'Healthy', up: true },
        { label: 'Pending', value: stats?.pendingRequests || 0, icon: Clock, color: 'amber', trend: 'Active', up: true },
        { label: 'Issued Today', value: stats?.issuedToday || 0, icon: ArrowUpRight, color: 'blue', trend: '+5', up: true },
        { label: 'Returned', value: stats?.returnedToday || 0, icon: ArrowDownLeft, color: 'orange', trend: 'Ongoing', up: false },
        { label: 'Overdue', value: stats?.overdueBooks || 0, icon: AlertTriangle, color: 'rose', trend: (stats?.overdueBooks || 0) > 0 ? 'Action Reqd' : 'Clear', up: false },
    ];

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-10 bg-[#fafafa] min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-brand-dark tracking-tight">Institutional Library ERP</h1>
                    </div>
                    <p className="text-gray-500 font-medium pl-10 text-sm uppercase tracking-widest">Operations & Analytics Dashboard</p>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigate('/app/library/issue')} className="px-6 py-3 bg-brand-dark text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95">Issue Book</button>
                    <button type="button" onClick={() => navigate('/app/library/return')} className="px-6 py-3 bg-white border border-gray-200 text-brand-dark rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all active:scale-95">Return Book</button>
                </div>
            </header>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="dash-card bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${card.color}-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700`}></div>
                        <div className={`p-3 rounded-2xl bg-${card.color}-50 w-fit mb-4 transition-colors group-hover:bg-${card.color}-100`}>
                            <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{card.label}</span>
                                <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full ${card.up ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                                    {card.trend}
                                </span>
                            </div>
                            <span className="text-4xl font-black text-brand-dark tracking-tighter tabular-nums">{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Trends Chart */}
                <div className="lg:col-span-2 dash-card bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-brand-dark tracking-tight">Circulation Trends</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Monthly Issue vs Returns Activity</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                                <span className="text-[10px] font-black uppercase text-gray-400">Issued</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-black uppercase text-gray-400">Returned</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.monthlyActivity || []}>
                                <defs>
                                    <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                                    cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="issued" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorIssued)" />
                                <Area type="monotone" dataKey="returned" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorReturned)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="dash-card bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-brand-dark tracking-tight">Departmental Mix</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Book Volume by Discipline</p>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.categoryDistribution || []}
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {(stats?.categoryDistribution || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {(stats?.categoryDistribution || []).slice(0, 4).map((cat, i) => (
                            <div key={i} className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                    <span className="text-[9px] font-black uppercase text-gray-400 truncate">{cat.name}</span>
                                </div>
                                <span className="text-sm font-black text-brand-dark ml-4">{(((cat.value || 0) / (stats?.totalBooks || 1)) * 100).toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Operation Panels & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Requests */}
                <div className="dash-card bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-brand-dark tracking-tight mb-6">Action Items</h3>
                    <div className="space-y-4">
                        {(stats?.recentRequests || []).length > 0 ? stats.recentRequests.map(req => (
                            <div key={req._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:border-indigo-100 group transition-all">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-600 shrink-0 capitalize">
                                        {req.studentId?.personalDetails?.fullName?.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black text-brand-dark truncate">{req.studentId?.personalDetails?.fullName}</p>
                                        <p className="text-[10px] text-gray-400 font-bold truncate tracking-tight">{req.bookId?.title}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button type="button"
                                        onClick={() => handleQuickApprove(req._id)}
                                        disabled={actionLoading === req._id}
                                        className="p-2 bg-white text-emerald-600 rounded-xl border border-gray-100 shadow-sm hover:bg-emerald-600 hover:text-white transition-all shadow-emerald-500/5 group-hover:shadow-emerald-500/20"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 opacity-40">
                                <CheckCircle className="w-10 h-10 mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No pending requests</p>
                            </div>
                        )}
                    </div>
                    <button type="button" onClick={() => navigate('/app/library/issue-requests')} className="w-full mt-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Review All Requests</button>
                </div>

                {/* Recent Transactions */}
                <div className="dash-card bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-brand-dark tracking-tight mb-6">Recent History</h3>
                    <div className="space-y-4">
                        {(stats?.recentTransactions || []).map(txn => (
                            <div key={txn._id} className="flex items-start gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 rounded-2xl transition-all">
                                <div className={`p-2 rounded-xl shrink-0 mt-1 ${txn.status === 'RETURNED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {txn.status === 'RETURNED' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className="text-xs font-black text-brand-dark truncate pr-2">{txn.bookId?.title}</p>
                                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter shrink-0">{new Date(txn.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-between">
                                        <p className="text-[10px] text-gray-500 font-bold truncate italic opacity-60">to {txn.studentId?.personalDetails?.fullName}</p>
                                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${txn.status === 'RETURNED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {txn.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Critical Alerts */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-brand-dark tracking-tight mb-6 flex items-center gap-2">
                        System Health
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </h3>

                    <div className="bg-rose-600 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-rose-600/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <span className="text-4xl font-black tracking-tighter">{stats?.alerts?.overdue || 0}</span>
                        </div>
                        <h4 className="text-lg font-black tracking-tight mb-2">Overdue Books</h4>
                        <p className="text-xs text-white/60 font-bold leading-relaxed">Critical attention required for high-risk lending durations.</p>
                        <button type="button" onClick={() => navigate('/app/library/issued-books')} className="mt-6 text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-white/30 hover:border-white transition-all pb-1 translate-y-0 group-hover:-translate-y-1 block w-fit">Take Action</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl w-fit mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <span className="text-[24px] font-black text-brand-dark block line-height-1 mb-1">{stats?.alerts?.lowStock || 0}</span>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Low Stock Alerts</span>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl w-fit mb-4 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <span className="text-[24px] font-black text-brand-dark block line-height-1 mb-1">{stats?.alerts?.damaged || 0}</span>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Damaged Copies</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryDashboard;
