import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
    LayoutDashboard, DollarSign, Users, CreditCard, 
    ArrowUpRight, ArrowDownRight, Activity, 
    Calendar, RefreshCw, Filter, Download,
    CheckCircle2, AlertCircle, Clock, Search,
    ChevronRight, Wallet, Receipt, TrendingUp,
    PieChart as PieChartIcon, BarChart as BarChartIcon,
    AlertTriangle, Lightbulb
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
    Legend
} from 'recharts';
import gsap from 'gsap';

const COLORS = ['#4F46E5', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#6366F1'];
const STATUS_COLORS = {
    paid: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    partial: 'text-amber-600 bg-amber-50 border-amber-100',
    unpaid: 'text-rose-600 bg-rose-50 border-rose-100'
};

const AccountsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dashboardRef = useRef(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/fees/staff/dashboard/enhanced', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setData(res.data.data);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && data && dashboardRef.current) {
            const sections = dashboardRef.current.querySelectorAll('.dashboard-section');
            gsap.fromTo(sections, 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [loading, data]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <RefreshCw className="w-10 h-10 animate-spin text-primary-600" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Financial Records...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <button type="button" onClick={fetchData} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold">Retry Now</button>
            </div>
        );
    }

    const { kpis, collectionTrend, courseWiseData, recentPayments, studentsAttention, structureSnapshot, modeInsight, recentReceipts } = data;

    return (
        <div ref={dashboardRef} className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
            {/* SECTION 1: HEADER */}
            <div className="dashboard-section flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Accounts Dashboard</h1>
                    <p className="text-gray-500 font-medium tracking-tight text-lg">Real-time fee operations and financial overview</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-2xl flex items-center shadow-sm">
                        <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                        <span className="text-sm font-bold text-gray-700">AY 2025-26</span>
                    </div>
                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-2xl flex items-center shadow-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase">Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <button type="button" 
                        onClick={fetchData}
                        className={`p-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 ${refreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* SECTION 2: PRIMARY KPI CARDS */}
            <div className="dashboard-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    title="Total Expected Collection" 
                    value={`₹${(kpis.primary.totalExpected / 1000000).toFixed(2)}M`} 
                    icon={DollarSign} 
                    color="bg-indigo-50 text-indigo-600"
                    description="Gross expected revenue"
                />
                <KPICard 
                    title="Total Collected" 
                    value={`₹${(kpis.primary.totalCollected / 1000000).toFixed(2)}M`} 
                    icon={CheckCircle2} 
                    color="bg-emerald-50 text-emerald-600"
                    description="Confirmed bank receipts"
                />
                <KPICard 
                    title="Outstanding Dues" 
                    value={`₹${(kpis.primary.totalOutstanding / 1000000).toFixed(2)}M`} 
                    icon={AlertCircle} 
                    color="bg-rose-50 text-rose-600"
                    description="Pending student balances"
                />
                <KPICard 
                    title="Active Fee Accounts" 
                    value={kpis.primary.activeAccounts} 
                    icon={Users} 
                    color="bg-amber-50 text-amber-600"
                    description="Initialized ledgers"
                />
            </div>

            {/* SECTION 3: SECONDARY KPI ROW */}
            <div className="dashboard-section grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusSmallCard title="Fully Paid" count={kpis.secondary.paid} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
                <StatusSmallCard title="Partially Paid" count={kpis.secondary.partial} icon={Activity} color="text-amber-600" bg="bg-amber-50" />
                <StatusSmallCard title="Unpaid" count={kpis.secondary.unpaid} icon={AlertCircle} color="text-rose-600" bg="bg-rose-50" />
                <StatusSmallCard title="Pending Init" count={kpis.secondary.pendingInitialization} icon={Clock} color="text-indigo-600" bg="bg-indigo-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SECTION 4: COLLECTION TREND */}
                <div className="dashboard-section lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Collection Trend Analytics</h3>
                            <p className="text-sm font-medium text-gray-500">Daily financial inflow over last 30 days</p>
                        </div>
                        <div className="flex gap-2">
                            {['7D', '30D', '90D'].map(range => (
                                <button type="button" key={range} className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all ${range === '30D' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={collectionTrend}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SECTION 5: PAYMENT STATUS DISTRIBUTION */}
                <div className="dashboard-section bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Status Distribution</h3>
                        <p className="text-sm font-medium text-gray-500">Student count by fee status</p>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Paid', value: kpis.secondary.paid },
                                        { name: 'Partial', value: kpis.secondary.partial },
                                        { name: 'Unpaid', value: kpis.secondary.unpaid }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    <Cell fill="#10B981" />
                                    <Cell fill="#F59E0B" />
                                    <Cell fill="#EF4444" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/50">
                            <span className="text-sm font-bold text-emerald-700">Fully Paid</span>
                            <span className="font-black text-emerald-800">{kpis.secondary.paid}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50">
                            <span className="text-sm font-bold text-amber-700">Partial</span>
                            <span className="font-black text-amber-800">{kpis.secondary.partial}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50">
                            <span className="text-sm font-bold text-rose-700">Unpaid</span>
                            <span className="font-black text-rose-800">{kpis.secondary.unpaid}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SECTION 6: COURSE-WISE COLLECTION */}
                <div className="dashboard-section bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Course-wise Revenue</h3>
                        <p className="text-sm font-medium text-gray-500">Collection breakdown by academic programs</p>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={courseWiseData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="course" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#374151' }} width={100} />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#4F46E5" radius={[0, 8, 8, 0]} barSize={32}>
                                    {courseWiseData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SECTION 10: PAYMENT MODE INSIGHT */}
                <div className="dashboard-section bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Payment Mode Insight</h3>
                        <p className="text-sm font-medium text-gray-500">Distribution of transaction channels</p>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={modeInsight}
                                    innerRadius={0}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {modeInsight.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {modeInsight.slice(0, 4).map((mode, i) => (
                            <div key={mode.name} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{mode.name}</p>
                                <p className="text-lg font-black text-gray-900">₹{(mode.total / 1000).toFixed(1)}K</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 7: RECENT PAYMENTS TABLE */}
            <div className="dashboard-section bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Recent Payment Ledger</h3>
                        <p className="text-sm font-medium text-gray-500">Latest 10 confirmed transactions</p>
                    </div>
                    <button type="button" className="text-primary-600 font-bold text-sm hover:underline">View All Entries</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Course</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mode</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentPayments.map((pay) => (
                                <tr key={pay._id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-gray-900">{pay.feeAccountId.studentId.personalDetails.fullName}</p>
                                        <p className="text-xs text-gray-400 font-medium">#{pay.feeAccountId.studentId.studentId}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {pay.feeAccountId.studentId.academicProfile.course}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-black text-gray-900">₹{pay.amount.toLocaleString()}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <Wallet className="w-3 h-3 text-primary-500" />
                                            <span className="text-xs font-bold text-gray-600 capitalize">{pay.paymentMode}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center text-emerald-600 font-bold text-xs">
                                            <CheckCircle2 className="w-4 h-4 mr-1" /> Success
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SECTION 8: STUDENTS REQUIRING ATTENTION */}
                <div className="dashboard-section lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Attention Required</h3>
                        <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        {studentsAttention.map(stu => (
                            <div key={stu._id} className="p-4 rounded-2xl border border-gray-50 bg-gray-50/30 hover:border-primary-100 hover:bg-primary-50/20 transition-all group">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-bold text-gray-900">{stu.studentId.personalDetails.fullName}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${STATUS_COLORS[stu.status]}`}>
                                        {stu.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">{stu.studentId.academicProfile.course} • Year {stu.studentId.academicProfile.yearNumber}</p>
                                        <p className="text-sm font-black text-rose-600 mt-1">Due: ₹{stu.balance.toLocaleString()}</p>
                                    </div>
                                    <button type="button" className="p-2 bg-white rounded-xl text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 9: FEE STRUCTURE SNAPSHOT */}
                <div className="dashboard-section lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Fee Structure Performance</h3>
                            <p className="text-sm font-medium text-gray-500">Revenue snapshot by enrollment type</p>
                        </div>
                        <button type="button" className="px-4 py-2 bg-primary-50 text-primary-700 rounded-xl font-bold text-xs hover:bg-primary-100 transition-all">
                            Analyze Impact
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {structureSnapshot.map(struct => (
                            <div key={struct._id} className="p-6 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-black text-gray-900 mb-4 truncate">{struct.name}</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expected</p>
                                        <p className="text-sm font-bold text-gray-900">₹{(struct.expectedRevenue/1000).toFixed(0)}K</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Students</p>
                                        <p className="text-sm font-bold text-gray-900">{struct.assignedStudents}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                            {Math.round((struct.collectedRevenue / struct.expectedRevenue) * 100)}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(struct.collectedRevenue / struct.expectedRevenue) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 11: RECENT RECEIPTS */}
            <div className="dashboard-section grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Recently Generated Receipts</h3>
                        <Receipt className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentReceipts.map(rcpt => (
                            <div key={rcpt._id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-all cursor-pointer">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-black text-primary-600 uppercase tracking-widest">{rcpt.receiptNumber}</p>
                                    <p className="text-sm font-bold text-gray-900 truncate">{rcpt.studentId.personalDetails.fullName}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{new Date(rcpt.generatedAt).toLocaleString()}</p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-300" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 12: SMART INSIGHTS STRIP */}
                <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl" />
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <Lightbulb className="w-6 h-6 text-primary-400" />
                        <h3 className="text-xl font-bold">Smart Insights</h3>
                    </div>
                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Highest Pending Dues</p>
                            <p className="text-sm font-bold text-gray-100">{courseWiseData[0]?.course || 'General'} program holds 42% of outstanding revenue.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment Preference</p>
                            <p className="text-sm font-bold text-gray-100">{modeInsight.sort((a,b) => b.value - a.value)[0]?.name || 'Cache'} is the most used payment channel this week.</p>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-xs text-primary-400 font-bold mb-3 italic">Recommendation:</p>
                            <p className="text-xs text-gray-400 leading-relaxed">Consider initiating fee initialization for {kpis.secondary.pendingInitialization} pending students to bridge the collection gap.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* HELPER COMPONENTS */

const KPICard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/50 transition-all group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
        </div>
        <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{value}</h3>
            <p className="text-[10px] text-gray-400 font-medium">{description}</p>
        </div>
    </div>
);

const StatusSmallCard = ({ title, count, icon: Icon, color, bg }) => (
    <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${bg} ${color}`}>
                <Icon className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-gray-500">{title}</p>
        </div>
        <p className={`text-lg font-black ${color}`}>{count}</p>
    </div>
);

const FileText = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M9 13h6" />
    <path d="M9 17h6" />
  </svg>
)

export default AccountsDashboard;
