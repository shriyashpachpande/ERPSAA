import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { 
    FileText, Award, AlertCircle, CheckCircle, 
    Download, RefreshCw, Filter, Calendar 
} from 'lucide-react';

const COLORS = ['#4F46E5', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#6366F1'];

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live</span>
        </div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
);

const ReportsPage = () => {
    const [overview, setOverview] = useState({
        total: 0, draft: 0, submitted: 0, underReview: 0,
        reuploadRequested: 0, approved: 0, rejected: 0
    });
    const [statusData, setStatusData] = useState([]);
    const [deptData, setDeptData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = '/api/admissions/reports';
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [ovRes, stRes, dpRes, trRes] = await Promise.all([
                axios.get(`${API_BASE}/overview`, config),
                axios.get(`${API_BASE}/status-breakdown`, config),
                axios.get(`${API_BASE}/department-breakdown`, config),
                axios.get(`${API_BASE}/monthly-trends`, config)
            ]);

            setOverview(ovRes.data.data);
            setStatusData(stRes.data.data);
            setDeptData(dpRes.data.data);
            setTrendData(trRes.data.data);
        } catch (err) {
            console.error('Error fetching report data', err);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <RefreshCw className="w-12 h-12 text-primary-600 animate-spin" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Generating Real-time Reports...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-500 font-medium tracking-tight text-lg">Real-time admission insights and statistical breakdown.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" className="flex items-center px-5 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm shadow-sm text-gray-700">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </button>
                    <button type="button" onClick={fetchAllData} className="p-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Applications" value={overview.total} icon={FileText} color="bg-indigo-50 text-indigo-600" />
                <StatCard title="Successful Admissions" value={overview.approved} icon={Award} color="bg-emerald-50 text-emerald-600" />
                <StatCard title="Pending Review" value={overview.submitted + overview.underReview} icon={Calendar} color="bg-amber-50 text-amber-600" />
                <StatCard title="Rejection Rate" value={overview.total ? Math.round((overview.rejected / overview.total) * 100) + '%' : '0%'} icon={AlertCircle} color="bg-rose-50 text-rose-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Breakdown (Pie) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Application Status Distribution</h3>
                        <p className="text-sm font-medium text-gray-500">Breakdown of applications by their current lifecycle stage.</p>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="status"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value, name) => [value, (name || 'Unknown').replace('_', ' ').toUpperCase()]}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Trends (Line) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Admission Volume Trend</h3>
                        <p className="text-sm font-medium text-gray-500">Monthly progression of application counts.</p>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9CA3AF' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={4} dot={{ r: 6, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Breakdown (Bar) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 lg:col-span-2">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Applications by Department</h3>
                        <p className="text-sm font-medium text-gray-500">Distribution across various academic departments.</p>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                                <XAxis type="number" axisLine={false} tickLine={false} hide />
                                <YAxis dataKey="department" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#374151' }} width={150} />
                                <Tooltip 
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#4F46E5" radius={[0, 10, 10, 0]} barSize={40}>
                                    {deptData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
