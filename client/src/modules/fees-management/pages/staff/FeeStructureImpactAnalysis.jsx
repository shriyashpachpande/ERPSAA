import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, 
    Users, 
    DollarSign, 
    TrendingUp, 
    PieChart as PieChartIcon,
    Calendar,
    ArrowUpRight,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle,
    BookOpen
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import gsap from 'gsap';

const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Paid, Partial, Unpaid

const FeeStructureImpactAnalysis = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/fees/staff/fee-structures/${id}/analysis`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data.data);
                setError(null);
            } catch (err) {
                setError('Failed to load impact analysis');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [id]);

    useEffect(() => {
        if (!loading && data) {
            gsap.from(".stat-card", {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            });
            gsap.from(".chart-panel", {
                opacity: 0,
                scale: 0.98,
                duration: 0.8,
                delay: 0.3,
                ease: "power2.out"
            });
        }
    }, [loading, data]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Calculating System Impact...</p>
        </div>
    );

    if (error || !data) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-6">
            <AlertCircle className="w-12 h-12 text-rose-500" />
            <h2 className="text-2xl font-black text-gray-900 italic">{error || 'No analysis data found'}</h2>
            <button onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Back to Structures</button>
        </div>
    );

    const { structure, adoption, finances, statusDistribution, recentPayments } = data;

    const pieData = [
        { name: 'Paid', value: statusDistribution.paid, color: '#10B981' },
        { name: 'Partial', value: statusDistribution.partial, color: '#F59E0B' },
        { name: 'Unpaid', value: statusDistribution.unpaid, color: '#EF4444' }
    ].filter(d => d.value > 0);

    return (
        <div className="p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Impact Analysis.</h1>
                            <span className="px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100">
                                Operational View
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500 italic">
                            Analyzing {structure.course} • Year {structure.yearNumber} • {structure.academicYear}
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat-card bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Adoption</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Assigned Students</p>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{adoption.assigned} <span className="text-sm text-gray-400">/ {adoption.totalEligible}</span></h3>
                    </div>
                </div>

                <div className="stat-card bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Collection</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Collected Revenue</p>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">₹{finances.totalCollected.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="stat-card bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                            <Clock className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Outstanding</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Pending Amount</p>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">₹{finances.totalOutstanding.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="stat-card bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Expectation</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Total Expected</p>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">₹{finances.totalExpected.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Distribution */}
                <div className="chart-panel bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 italic">Payment Status Distribution</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time lifecycle breakdown.</p>
                    </div>
                    <div className="h-[300px] w-full">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                        labelStyle={{ fontWeight: 900 }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36}
                                        formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full space-y-4">
                                <PieChartIcon className="w-12 h-12 text-gray-100" />
                                <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No data to distribute</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Structure Detail */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 italic">Financial Components</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Detailed pricing breakdown.</p>
                    </div>
                    <div className="space-y-4">
                        {structure.components.map((comp, idx) => (
                            <div key={idx} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-primary-200 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-black text-gray-700">{comp.name}</span>
                                </div>
                                <span className="text-lg font-black text-gray-900">₹{comp.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 bg-gray-900 rounded-[2rem] text-white flex justify-between items-center shadow-xl shadow-gray-200">
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Total Structure Value</span>
                        <span className="text-3xl font-black italic">₹{structure.totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Recent Payments Table */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 italic">Recent Activity</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Latest transactions for this structure.</p>
                    </div>
                    <button className="px-5 py-3 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto overflow-y-visible">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <th className="text-left pb-6 px-4">Student</th>
                                <th className="text-left pb-6 px-4">Amount</th>
                                <th className="text-left pb-6 px-4">Mode</th>
                                <th className="text-left pb-6 px-4">Date</th>
                                <th className="text-right pb-6 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentPayments.length > 0 ? recentPayments.map((payment, idx) => (
                                <tr key={idx} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="py-6 px-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-black text-xs">
                                                {payment.feeAccountId?.studentId?.personalDetails?.fullName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{payment.feeAccountId?.studentId?.personalDetails?.fullName}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase">{payment.feeAccountId?.studentId?.studentId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <p className="text-sm font-black text-gray-900">₹{payment.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            {payment.paymentMode}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4">
                                        <p className="text-[10px] font-black text-gray-500 uppercase">
                                            {new Date(payment.paymentDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </p>
                                    </td>
                                    <td className="py-6 px-4 text-right">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                            <CheckCircle2 className="w-3 h-3" /> Success
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                            <Clock className="w-10 h-10" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">No recent transactions</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeeStructureImpactAnalysis;
