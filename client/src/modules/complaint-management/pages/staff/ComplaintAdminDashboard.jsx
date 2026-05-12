import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { LayoutDashboard, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useComplaintAnalyticsSummary } from '../../../../hooks/complaint-management/useComplaintAnalyticsSummary';

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#64748b'];

const ComplaintAdminDashboard = () => {
    const { analytics, loading, error } = useComplaintAnalyticsSummary();

    if (loading) return <div className="p-8 text-center animate-pulse">Loading analytics...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const statusData = analytics?.statusDistribution?.map(s => ({ name: s._id.replace('_', ' '), value: s.count })) || [];
    const categoryData = analytics?.categoryDistribution?.map(c => ({ name: c._id, count: c.count })) || [];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <LayoutDashboard size={28} />
                    </div>
                    Complaints Analytics
                </h1>
                <p className="text-slate-500 font-medium mt-1">Global overview of system performance and ticket volume</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-4">
                    <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl"><AlertCircle size={24} /></div>
                    <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Tickets</div>
                        <div className="text-2xl font-black text-slate-900">
                            {analytics?.statusDistribution?.reduce((acc, curr) => 
                                ['resolved', 'closed', 'rejected'].includes(curr._id) ? acc : acc + curr.count, 0) || 0}
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl"><CheckCircle size={24} /></div>
                    <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Resolved Total</div>
                        <div className="text-2xl font-black text-slate-900">
                            {analytics?.statusDistribution?.find(s => s._id === 'resolved')?.count || 0}
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl"><Users size={24} /></div>
                    <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Unique Reporters</div>
                        <div className="text-2xl font-black text-slate-900">Calculated</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Distribution */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
                    <h3 className="font-bold text-slate-800 mb-6">Status Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Bar Chart */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
                    <h3 className="font-bold text-slate-800 mb-6">Tickets by Category</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Complaints */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
                    <h3 className="font-bold text-slate-800 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {analytics?.recentComplaints?.map((comp) => (
                            <div key={comp._id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="font-mono text-[10px] text-blue-600 font-bold">{comp.complaintCode}</div>
                                    <div className="font-bold text-slate-800">{comp.title}</div>
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                    {new Date(comp.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintAdminDashboard;
