import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
    AreaChart, Area
} from 'recharts';
import { 
    FileText, Award, AlertCircle, CheckCircle, 
    Download, RefreshCw, Filter, Calendar,
    TrendingUp, DollarSign, Users, CreditCard,
    ArrowUpRight, ArrowDownRight, Briefcase, BookOpen
} from 'lucide-react';
import gsap from 'gsap';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#06B6D4'];

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="stat-card bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl group">
        <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-50 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trendValue}
                </div>
            )}
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 italic">{title}</p>
        <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
        </div>
    </div>
);

const AccountsReportsPage = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/fees/staff/reports/accounts-summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportData(res.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to load report data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    useEffect(() => {
        if (!loading && reportData) {
            gsap.fromTo(".stat-card", 
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power2.out",
                    clearProps: "all"
                }
            );
            gsap.fromTo(".report-panel", 
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                    clearProps: "all"
                }
            );
        }
    }, [loading, reportData]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <RefreshCw className="w-10 h-10 text-primary-600 animate-spin" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Consolidating Financial Ledger...</p>
        </div>
    );

    if (error || !reportData) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-6">
            <AlertCircle className="w-12 h-12 text-rose-500" />
            <h2 className="text-2xl font-black text-gray-900 italic">{error || 'No data available'}</h2>
            <button type="button" onClick={fetchReport} className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Retry</button>
        </div>
    );

    const { totalKpis, courseReport, modeReport, statusReport, highValuePayments } = reportData;

    const pieData = statusReport.map((s, idx) => ({
        name: s._id.toUpperCase(),
        value: s.count,
        color: COLORS[idx % COLORS.length]
    })).filter(d => d.value > 0);

    const barData = courseReport.map(c => ({
        name: c._id,
        collected: c.collected,
        outstanding: c.outstanding
    }));

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight italic">Accounts Reports.</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Comprehensive institutional financial analytics.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button type="button" className="flex items-center px-8 py-4 bg-white border border-gray-100 rounded-3xl text-xs font-black uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition-all shadow-sm">
                        <Download className="w-4 h-4 mr-3" /> Export Report
                    </button>
                    <button type="button" onClick={fetchReport} className="p-4 bg-gray-900 text-white rounded-3xl hover:bg-black transition-all shadow-xl shadow-gray-200">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard 
                    title="Expected Revenue" 
                    value={`₹${totalKpis.totalExpected.toLocaleString()}`} 
                    icon={TrendingUp} 
                    color="bg-indigo-50 text-indigo-600"
                    trend="up"
                    trendValue="Total Cap"
                />
                <StatCard 
                    title="Total Collected" 
                    value={`₹${totalKpis.totalCollected.toLocaleString()}`} 
                    icon={DollarSign} 
                    color="bg-emerald-50 text-emerald-600"
                    trend="up"
                    trendValue={`${Math.round((totalKpis.totalCollected / totalKpis.totalExpected) * 100)}%`}
                />
                <StatCard 
                    title="Active Accounts" 
                    value={totalKpis.activeAccounts} 
                    icon={Users} 
                    color="bg-amber-50 text-amber-600"
                    trend="up"
                    trendValue="Active"
                />
                <StatCard 
                    title="Outstanding" 
                    value={`₹${totalKpis.totalOutstanding.toLocaleString()}`} 
                    icon={AlertCircle} 
                    color="bg-rose-50 text-rose-600"
                    trend="down"
                    trendValue="Arrears"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Course-wise Analysis (Bar) */}
                <div className="report-panel bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10 lg:col-span-2">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 italic">Course-wise Revenue Analysis</h3>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Collected vs Outstanding breakdown.</p>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} 
                                />
                                <Tooltip 
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend 
                                    verticalAlign="top" 
                                    height={36}
                                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{value}</span>}
                                />
                                <Bar dataKey="collected" fill="#4F46E5" radius={[10, 10, 0, 0]} barSize={32} />
                                <Bar dataKey="outstanding" fill="#F43F5E" radius={[10, 10, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution (Pie) */}
                <div className="report-panel bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 italic">Account Lifecycle</h3>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Payment status distribution.</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-gray-50">
                        {statusReport.map((s, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s._id}</span>
                                <span className="text-lg font-black text-gray-900">{s.count} <span className="text-xs text-gray-400 uppercase font-bold ml-1">students</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row - Payment Modes and High Value Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="report-panel bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 italic">Payment Channels</h3>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Revenue by payment mode.</p>
                    </div>
                    <div className="space-y-6">
                        {modeReport.map((mode, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between mb-2">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{mode._id}</span>
                                    <span className="text-sm font-black text-gray-900">₹{mode.amount.toLocaleString()}</span>
                                </div>
                                <div className="h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                    <div 
                                        className="h-full bg-primary-600 rounded-full group-hover:bg-primary-500 transition-all duration-1000"
                                        style={{ width: `${Math.min(100, (mode.amount / totalKpis.totalCollected) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{mode.count} Successful transactions</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="report-panel bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 italic">High-Value Collection</h3>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Top recent payment entries.</p>
                    </div>
                    <div className="space-y-4">
                        {highValuePayments.map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:border-emerald-200 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-emerald-600 font-black italic">
                                        ₹
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">{p.feeAccountId?.studentId?.personalDetails?.fullName}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">{p.paymentMode} • {new Date(p.paymentDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-emerald-600">₹{p.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountsReportsPage;
