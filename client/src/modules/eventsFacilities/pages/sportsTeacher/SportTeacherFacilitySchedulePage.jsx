import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Users, MapPin, Clock, Search, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';

const SportTeacherFacilitySchedulePage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        facility: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [stats, setStats] = useState({
        totalFacilities: 0,
        bookedToday: 0,
        upcomingBookings: 0
    });

    useEffect(() => {
        fetchMetadata();
        fetchSchedule();
    }, []);

    useEffect(() => {
        fetchSchedule();
    }, [filters]);

    const fetchMetadata = async () => {
        try {
            const token = localStorage.getItem('token');
            const [catRes, facRes] = await Promise.all([
                fetch('/api/eventsFacilities/catalog/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/eventsFacilities/catalog/facilities', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const catData = await catRes.json();
            const facData = await facRes.json();
            
            if (catData.success) setCategories(catData.data);
            if (facData.success) {
                setFacilities(facData.data);
                setStats(prev => ({ ...prev, totalFacilities: facData.data.length }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let query = `/api/eventsFacilities/management/schedule?date=${filters.date}`;
            if (filters.category) query += `&category=${filters.category}`;
            if (filters.facility) query += `&facility=${filters.facility}`;

            const res = await fetch(query, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBookings(data.data);
                if (filters.date === new Date().toISOString().split('T')[0]) {
                    setStats(prev => ({ 
                        ...prev, 
                        bookedToday: data.data.length,
                        upcomingBookings: data.data.filter(b => new Date(`${b.date.split('T')[0]}T${b.startTime}`) > new Date()).length
                    }));
                }
            }
        } catch (err) {
            toast.error("Failed to load schedule");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-2xl border-l border-slate-200">
            {/* Header */}
            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-slate-900">Facility Schedule</h1>
                        <p className="text-slate-500 text-lg font-medium">Operational overview of campus facility utilization.</p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <LayoutGrid className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Facilities</p>
                                <h3 className="text-3xl font-black text-slate-900">{stats.totalFacilities}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Booked Today</p>
                                <h3 className="text-3xl font-black text-slate-900">{stats.bookedToday}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Upcoming Events</p>
                                <h3 className="text-3xl font-black text-slate-900">{stats.upcomingBookings}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Date</label>
                        <input 
                            type="date" 
                            value={filters.date}
                            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                        <select 
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, facility: '' }))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Facility</label>
                        <select 
                            value={filters.facility}
                            onChange={(e) => setFilters(prev => ({ ...prev, facility: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 outline-none"
                        >
                            <option value="">All Facilities</option>
                            {facilities
                                .filter(f => !filters.category || f.categorySlug === filters.category)
                                .map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Schedule Table */}
                <div className="bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center p-20">
                            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="p-20 text-center text-slate-400">
                            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-slate-600">No bookings scheduled</h3>
                            <p>Try adjusting your filters or date.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200/60 text-xs uppercase tracking-widest text-slate-500 font-black">
                                        <th className="p-5 font-bold">Facility</th>
                                        <th className="p-5 font-bold">Time Slot</th>
                                        <th className="p-5 font-bold">Student Name</th>
                                        <th className="p-5 font-bold">Purpose</th>
                                        <th className="p-5 font-bold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bookings.map(b => (
                                        <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-5">
                                                <p className="font-bold text-slate-900">{b.facilityId?.name || b.facilityName}</p>
                                                <p className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded inline-block font-black uppercase tracking-wider mt-1 border border-slate-200">
                                                    {b.categorySlug?.replace('-', ' ')}
                                                </p>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                    {b.startTime} - {b.endTime}
                                                </div>
                                            </td>
                                            <td className="p-5 text-sm font-bold text-slate-700">
                                                {b.studentName}
                                            </td>
                                            <td className="p-5">
                                                <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-xs">{b.purpose}</p>
                                            </td>
                                            <td className="p-5 text-right">
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SportTeacherFacilitySchedulePage;
