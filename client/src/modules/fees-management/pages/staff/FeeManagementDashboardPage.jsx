import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../../utils/axiosInstance';
import {
    Users, TrendingUp, AlertCircle, DollarSign,
    ArrowUpRight, ArrowDownRight, RefreshCw,
    Calendar, Search, Filter, Download, PieChart as PieIcon
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import gsap from 'gsap';

const COLORS = ['#4F46E5', '#F59E0B', '#EF4444', '#10B981'];

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
        <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trendValue}
                </div>
            )}
        </div>
        <p className="text-sm font-bold text-gray-500 mb-1">{title}</p>
        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">
            {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
        </h3>
    </div>
);

const FeeManagementDashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const statsRef = useRef(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await axiosInstance.get('/fees/staff/dashboard');
            setData(res.data.data);

            // GSAP Animation
            setTimeout(() => {
                if (statsRef.current) {
                    gsap.fromTo(statsRef.current.children,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
                    );
                }
            }, 100);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
            <RefreshCw className="w-12 h-12 text-primary-600 animate-spin" />
            <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Synchronizing Financial Data...</p>
        </div>
    );

    if (error) return (
        <div className="p-10 flex flex-col items-center justify-center min-h-[500px] space-y-6">
            <div className="p-6 bg-rose-50 rounded-full">
                <AlertCircle className="w-12 h-12 text-rose-500" />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-gray-900 italic">Financial Sync Error.</h3>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{error}</p>
            </div>
            <button type="button" onClick={fetchDashboardData} className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-2xl">
                <RefreshCw className="w-4 h-4" /> Re-establish Connection
            </button>
        </div>
    );

    if (!data) return null;

    const { stats, recentPayments } = data;
    const efficiency = stats && stats.totalExpected > 0
        ? Math.round((stats.totalCollected / stats.totalExpected) * 100)
        : 0;

    // Prepare chart data
    const pieData = [
        { name: 'Collected', value: stats.totalCollected },
        { name: 'Outstanding', value: stats.totalOutstanding }
    ];


    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-brand-dark p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-5xl font-black tracking-tighter mb-2 italic">Fee Analytics.</h1>
                    <p className="text-white/60 font-medium text-lg max-w-md">Financial oversight and collection monitoring center for ERPSAA.</p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <button type="button" className="flex items-center px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-2xl transition-all font-bold text-sm">
                        <Calendar className="w-4 h-4 mr-2" /> Current Session
                    </button>
                    <button type="button" onClick={fetchDashboardData} className="p-4 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/30 group">
                        <RefreshCw className="w-5 h-5 group-active:rotate-180 transition-transform duration-500" />
                    </button>
                </div>
                {/* Abstract Blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* KPI Stats */}
            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Expected Collection" value={stats.totalExpected} icon={TrendingUp} color="bg-indigo-50 text-indigo-600" trend="up" trendValue="12.5%" />
                <StatCard title="Total Realized" value={stats.totalCollected} icon={DollarSign} color="bg-emerald-50 text-emerald-600" trend="up" trendValue="8.2%" />
                <StatCard title="Pending Revenue" value={stats.totalOutstanding} icon={AlertCircle} color="bg-rose-50 text-rose-600" trend="down" trendValue="5.4%" />
                <StatCard title="Total Students" value={stats.count} icon={Users} color="bg-amber-50 text-amber-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Collection Summary (Pie) */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 lg:col-span-1">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Collection Health</h3>
                        <p className="text-sm font-medium text-gray-500">Ratio of realized vs outstanding dues.</p>
                    </div>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-gray-900">{efficiency}%</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Efficiency</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {pieData.map((d, i) => (
                            <div key={d.name} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                    <span className="text-sm font-bold text-gray-600">{d.name}</span>
                                </div>
                                <span className="text-sm font-black text-gray-900">₹{d.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Payments Table */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Activity</h3>
                            <p className="text-sm font-medium text-gray-500">Live stream of latest fee transactions.</p>
                        </div>
                        <button type="button" className="p-4 bg-gray-50 text-gray-900 hover:bg-gray-100 rounded-2xl transition-all shadow-sm group">
                            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    </div>

                    <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-right">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentPayments.map((p) => (
                                    <tr key={p._id} className="group hover:bg-gray-50/80 transition-all cursor-pointer">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-black text-xs border border-primary-200">
                                                    {p.feeAccountId?.studentId?.personalDetails?.fullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors">{p.feeAccountId?.studentId?.personalDetails?.fullName}</p>
                                                    <p className="text-xs font-bold text-gray-400">{p.feeAccountId?.studentId?.studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-gray-900">{new Date(p.paymentDate).toLocaleDateString()}</p>
                                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{p.paymentMode}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-lg font-black text-gray-900">₹{p.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button type="button" className="p-3 bg-gray-50 text-gray-400 group-hover:bg-primary-600 group-hover:text-white rounded-xl transition-all">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChevronRight = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export default FeeManagementDashboardPage;
