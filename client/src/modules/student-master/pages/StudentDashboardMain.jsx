import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    GraduationCap, BookOpen, DollarSign, HeartPulse,
    Calendar, Bell, Search, Settings2, ChevronRight,
    MessageSquare, CheckCircle, Clock, FileText,
    Download, LayoutGrid, Users, Briefcase, HelpCircle,
    Package, MapPin, Loader2, BookMarked, AlertCircle
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, subValue, icon: Icon, color, trend, delay, path }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] transition-all group cursor-pointer"
    >
        <Link to={path || '#'}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${color} text-white shadow-lg shadow-${color.split('-')[1]}-100 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend} {trend.startsWith('+') ? '↑' : '↓'}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{value}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</p>
                {subValue && <p className="text-xs text-primary-600 font-bold mt-2 hover:underline">{subValue}</p>}
            </div>
        </Link>
    </motion.div>
);

const StudentDashboardMain = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/dashboard/student', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching dashboard:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
            <p className="text-gray-500 font-medium animate-pulse">Building your campus overview...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-500 max-w-md">{error}</p>
        </div>
    );

    // Mock data for charts if real data isn't available
    const attendanceTrend = data?.charts?.attendanceTrend?.length > 0
        ? data.charts.attendanceTrend
        : [
            { name: '1 May', value: 65 },
            { name: '6 May', value: 72 },
            { name: '11 May', value: 68 },
            { name: '16 May', value: 80 },
            { name: '21 May', value: 85 },
        ];

    const libraryUsage = data?.charts?.libraryUsage?.length > 0
        ? data.charts.libraryUsage
        : [
            { name: 'Week 1', value: 12 },
            { name: 'Week 2', value: 18 },
            { name: 'Week 3', value: 15 },
            { name: 'Week 4', value: 13 },
            { name: 'Week 5', value: 22 },
        ];

    const leaveStatusData = data?.charts?.leaveStatus?.length > 0
        ? data.charts.leaveStatus
        : [
            { name: 'Approved', value: 2, color: '#10b981' },
            { name: 'Pending', value: 1, color: '#f59e0b' },
            { name: 'Rejected', value: 0, color: '#ef4444' },
        ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            Welcome back, {data?.student?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Here's your campus overview</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-semibold text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <button
                            onClick={() => toast.success('Customization mode enabled!')}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            <Settings2 className="w-4 h-4" />
                            Customize
                        </button>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Attendance"
                        value={`${data?.stats?.attendance}%`}
                        icon={GraduationCap}
                        color="bg-indigo-500"
                        trend="+5% this month"
                        delay={0.1}
                        path="/app/student/my-attendance"
                    />
                    <StatCard
                        title="Books Issued"
                        value={data?.stats?.booksIssued}
                        subValue={`${data?.stats?.booksIssued > 0 ? '2 due in 5 days' : 'No books issued'}`}
                        icon={BookOpen}
                        color="bg-emerald-500"
                        delay={0.2}
                        path="/app/student/library/my-books"
                    />
                    <StatCard
                        title="Fees Paid"
                        value={`₹${data?.stats?.feesPaid?.toLocaleString()}`}
                        subValue="View transaction history"
                        icon={DollarSign}
                        color="bg-blue-500"
                        delay={0.3}
                        path="/app/student/fees"
                    />
                    <StatCard
                        title="Active Leave"
                        value={data?.stats?.activeLeaves}
                        subValue="View leave status"
                        icon={HeartPulse}
                        color="bg-rose-500"
                        delay={0.4}
                        path="/app/student/leave/history"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* Left Column - Charts & Timetable (8 columns) */}
                    <div className="xl:col-span-8 space-y-8">

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Attendance Trend */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-gray-900">Attendance Trend</h3>
                                    <select className="text-sm font-bold bg-gray-50 border-none rounded-lg px-3 py-1 text-gray-600 focus:ring-2 ring-primary-500">
                                        <option>This Month</option>
                                        <option>Last Month</option>
                                    </select>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={attendanceTrend}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                itemStyle={{ fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            {/* Library Usage */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-gray-900">Library Usage</h3>
                                    <select className="text-sm font-bold bg-gray-50 border-none rounded-lg px-3 py-1 text-gray-600 focus:ring-2 ring-primary-500">
                                        <option>This Month</option>
                                        <option>Last Month</option>
                                    </select>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={libraryUsage}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                                            <Tooltip
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            />
                                            <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-xs font-bold text-gray-500">Books Issued</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom Row - Timetable & Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* My Timetable */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-gray-900">My Timetable</h3>
                                    <Link to="/app/student/my-timetable" className="text-sm font-bold text-primary-600 hover:underline">View All</Link>
                                </div>
                                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                    {data?.timetable?.length > 0 ? (
                                        data.timetable.map((item, idx) => (
                                            <div key={item.id} className="flex gap-6 relative group">
                                                <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm shrink-0 z-10 transition-colors ${idx === 0 ? 'bg-primary-500' : 'bg-gray-200'}`} />
                                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-400 mb-1">{item.time}</p>
                                                        <h4 className="font-bold text-gray-900">{item.subject}</h4>
                                                        <p className="text-xs font-medium text-gray-500">{item.code} • Room {item.room}</p>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${idx === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                        {idx === 0 ? 'Live' : 'Upcoming'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No classes scheduled for today</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Recent Activity */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                                    <Link to="/app/student/complaints/my" className="text-sm font-bold text-primary-600 hover:underline">View All</Link>
                                </div>
                                <div className="space-y-6">
                                    {data?.activities?.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-4 group">
                                            <div className={`p-2.5 rounded-xl bg-${activity.color}-50 text-${activity.color}-500 shrink-0`}>
                                                {activity.icon === 'MessageSquare' ? <MessageSquare className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                                                    {activity.title}
                                                </p>
                                                <p className="text-xs font-medium text-gray-500 mt-0.5">
                                                    {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Quick Access Grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                            {[
                                { label: 'My Documents', icon: Package, color: 'bg-blue-500', path: '/app/student/admission/documents' },
                                { label: 'Hostel', icon: LayoutGrid, color: 'bg-indigo-500', path: '/app/student/hostel' },
                                { label: 'Transport', icon: Users, color: 'bg-emerald-500', path: '/app/student/events/home' },
                                { label: 'Notices', icon: Bell, color: 'bg-amber-500', path: '/app/student/notifications' },
                                { label: 'Profile', icon: Users, color: 'bg-primary-500', path: '/app/student/profile' },
                                { label: 'Help Desk', icon: HelpCircle, color: 'bg-rose-500', path: '/app/student/complaints/raise' },
                            ].map((item, idx) => (
                                <motion.button
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.9 + (idx * 0.05) }}
                                    onClick={() => navigate(item.path)}
                                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] transition-all flex flex-col items-center gap-3 group"
                                >
                                    <div className={`p-3 rounded-xl ${item.color} text-white group-hover:shadow-lg transition-all`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-600 tracking-tight text-center">{item.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Library Status, Leave & Notices (4 columns) */}
                    <div className="xl:col-span-4 space-y-8">

                        {/* My Library Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-gray-900">My Library Status</h3>
                                <Link to="/app/student/library/my-books" className="text-sm font-bold text-primary-600 hover:underline">View All</Link>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Currently Issued (3)</h4>
                                    <div className="space-y-4">
                                        {data?.library?.currentIssued?.map((book) => (
                                            <div key={book.id} className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                                                <div className="w-12 h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-gray-400">
                                                    <BookMarked className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-sm font-bold text-gray-900 line-clamp-1">{book.title}</h5>
                                                    <p className="text-[10px] font-medium text-gray-500 mb-1">{book.author}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-bold text-gray-400">Due: {new Date(book.dueDate).toLocaleDateString()}</span>
                                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${book.status === 'OVERDUE' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                            {book.status === 'OVERDUE' ? 'Due Soon' : 'Issued'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Overdue (1)</h4>
                                    <div className="flex gap-4 p-3 rounded-2xl bg-rose-50 border border-rose-100">
                                        <div className="w-12 h-16 bg-white rounded-lg shrink-0 flex items-center justify-center text-rose-300">
                                            <BookMarked className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-sm font-bold text-gray-900 line-clamp-1">Database System Concepts</h5>
                                            <p className="text-[10px] font-medium text-gray-500 mb-1">H. Korth</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-rose-400">Due: 10 May 2024</span>
                                                <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-white text-rose-600 border border-rose-100">
                                                    Overdue
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Leave Status Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-gray-900">Leave Status</h3>
                                <Link to="/app/student/leave/history" className="text-sm font-bold text-primary-600 hover:underline">View All</Link>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-32 h-32 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={leaveStatusData}
                                                innerRadius={45}
                                                outerRadius={60}
                                                paddingAngle={8}
                                                dataKey="value"
                                            >
                                                {leaveStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-xs font-bold text-gray-400 leading-none">Total</span>
                                        <span className="text-2xl font-black text-gray-900">
                                            {leaveStatusData.reduce((acc, curr) => acc + curr.value, 0)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-3">
                                    {leaveStatusData.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-xs font-bold text-gray-500">{item.name}</span>
                                            </div>
                                            <span className="text-xs font-black text-gray-900">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Important Notices */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-gray-900">Important Notices</h3>
                                <Link to="/app/student/notifications" className="text-sm font-bold text-primary-600 hover:underline">View All</Link>
                            </div>

                            <div className="space-y-6">
                                {data?.notices?.map((notice) => (
                                    <div key={notice.id} className="flex gap-4 group">
                                        <div className={`px-2 py-0.5 h-fit rounded-md text-[8px] font-black uppercase tracking-wider ${notice.type === 'NEW' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {notice.type === 'NEW' ? 'NEW' : 'INFO'}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-gray-800 group-hover:text-primary-600 transition-colors leading-tight">
                                                {notice.title}
                                            </p>
                                            <p className="text-[10px] font-medium text-gray-400 mt-1">
                                                {new Date(notice.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Footer Attribution */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest gap-4">
                    <p>© 2024 ERPΣAA. All rights reserved.</p>
                    <p>Version 2.5.0</p>
                </div>
            </div>
    );
};

export default StudentDashboardMain;
