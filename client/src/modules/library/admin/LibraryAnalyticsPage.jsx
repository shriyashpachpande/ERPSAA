import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, BookOpen, Users, AlertCircle, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, RefreshCcw, Download } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';

const AdminLibraryAnalyticsPage = () => {
    const { getAdvancedAnalytics, loading } = useLibrary();
    const [stats, setStats] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await getAdvancedAnalytics();
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading && !stats) return <div className="p-10 text-center animate-pulse font-black text-gray-300">Generating Intelligence Report...</div>;

    const inventory = stats?.inventoryStats || {};
    const fineStats = stats?.fineStats || [];
    const totalFines = fineStats.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const remainingFines = fineStats.reduce((acc, curr) => acc + curr.remainingAmount, 0);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-brand-dark tracking-tighter">Library Insights</h1>
                    <p className="text-gray-500 font-medium capitalize">Real-time circulation and inventory intelligence</p>
                </div>
                <div className="flex gap-4">
                    <button type="button" onClick={fetchStats} className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary-600 transition-all shadow-sm">
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button type="button" className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200">
                        <Download className="w-5 h-5" />
                        Export Report
                    </button>
                </div>
            </header>

            {/* Top Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Collection" value={inventory.totalCopies || 0} subValue="+12 this month" icon={<BookOpen />} color="indigo" />
                <KPICard title="Active Circulation" value={inventory.totalCopies - inventory.availableCopies || 0} subValue="78% Utilization" icon={<TrendingUp />} color="emerald" />
                <KPICard title="Outstanding Fines" value={`₹${remainingFines}`} subValue="Across 42 students" icon={<DollarSign />} color="amber" />
                <KPICard title="Lost / Damaged" value="8" subValue="2.4% Asset Loss" icon={<AlertCircle />} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Popular Books Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-xl font-black text-brand-dark flex items-center gap-3">
                            <BarChart3 className="w-6 h-6 text-indigo-500" />
                            Most Popular Books
                        </h3>
                        <button type="button" className="text-xs font-black uppercase text-primary-600 tracking-widest">View All</button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {stats?.popularBooks?.map((item, idx) => (
                            <div key={item._id} className="glass-panel p-6 flex items-center justify-between group hover:bg-indigo-50/10 transition-colors">
                                <div className="flex items-center gap-6">
                                    <span className="text-2xl font-black text-gray-200 group-hover:text-indigo-200 transition-colors">#{idx + 1}</span>
                                    <div>
                                        <h4 className="font-black text-brand-dark">{item.book.title}</h4>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.book.author}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-indigo-600">{item.count}</div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Issues</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fine Breakdown */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-xl font-black text-brand-dark flex items-center gap-3">
                            <PieChart className="w-6 h-6 text-amber-500" />
                            Fine Status
                        </h3>
                    </div>

                    <div className="glass-panel p-8 space-y-8">
                        {fineStats.map(stat => (
                            <div key={stat._id} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat._id}</span>
                                    <span className="font-black text-brand-dark">₹{stat.totalAmount}</span>
                                </div>
                                <div className="h-3 bg-gray-50 rounded-full overflow-hidden flex">
                                    <div 
                                        className={`h-full ${
                                            stat._id === 'PAID' ? 'bg-emerald-500' : 
                                            stat._id === 'UNPAID' ? 'bg-red-500' : 'bg-amber-500'
                                        }`} 
                                        style={{ width: `${(stat.totalAmount / (totalFines || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        
                        <div className="pt-6 border-t border-gray-50">
                            <div className="flex items-center justify-between bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 opacity-60">Estimated Revenue</p>
                                    <p className="text-2xl font-black text-emerald-700">₹{totalFines - remainingFines}</p>
                                </div>
                                <ArrowUpRight className="w-8 h-8 text-emerald-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, subValue, icon, color }) => {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        red: "bg-red-50 text-red-600 border-red-100"
    };

    return (
        <div className={`glass-panel p-8 border-l-8 ${colors[color]} relative group hover:scale-[1.02] transition-transform`}>
            <div className="p-3 bg-white/50 w-fit rounded-2xl shadow-sm mb-4">
                {React.cloneElement(icon, { className: "w-6 h-6" })}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{title}</p>
            <h2 className="text-3xl font-black text-brand-dark mt-1">{value}</h2>
            <p className="text-[10px] font-bold text-gray-400 mt-2 flex items-center gap-1">
                {subValue}
            </p>
        </div>
    );
};

export default AdminLibraryAnalyticsPage;
