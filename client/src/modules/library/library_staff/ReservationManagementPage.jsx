import React, { useEffect, useState } from 'react';
import { Search, Clock, User, BookOpen, AlertCircle, CheckCircle, XCircle, MoreVertical, RefreshCw, Filter, ListOrdered } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';

const StaffReservationManagementPage = () => {
    const { getBookReservations, cancelReservation, loading } = useLibrary();
    // In a real app, we'd fetch all reservations or search by book. 
    // Here we'll start with a search interface.
    const [searchTerm, setSearchTerm] = useState('');
    const [reservations, setReservations] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm) return;
        setSearching(true);
        try {
            // Assume we search for a book first, then its reservations
            // For now, let's assume we can fetch all active reservations if needed
            // But usually this is book-specific
            const res = await getBookReservations(searchTerm);
            setReservations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this reservation?')) return;
        try {
            await cancelReservation(id);
            handleSearch();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark tracking-tight">Reservation Queues</h1>
                    <p className="text-gray-500 font-medium">Monitor waitlists and manage hold fulfillment</p>
                </div>
            </header>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-8 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-2">Lookup by Book ID (Database ID)</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Enter specific Book ID to view its queue..." 
                                className="w-full pl-11 pr-4 py-4 bg-white border-2 border-transparent focus:border-primary-500 rounded-3xl outline-none font-black text-sm transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="button" 
                        onClick={handleSearch}
                        disabled={searching || !searchTerm}
                        className="px-10 py-4 bg-brand-dark text-white rounded-3xl font-black flex items-center gap-3 hover:bg-black transition-all active:scale-95 disabled:grayscale shadow-xl shadow-gray-200"
                    >
                        {searching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ListOrdered className="w-5 h-5" />}
                        View Queue
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Priority</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Request Time</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-right font-medium text-gray-400"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm font-medium">
                            {reservations.length > 0 ? reservations.map((res, idx) => (
                                <tr key={res._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                                            idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {idx + 1}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-black text-xs uppercase">
                                                {res.studentId?.personalDetails?.fullName?.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-dark">{(res.studentId?.personalDetails?.fullName) || 'Unknown Student'}</p>
                                                <p className="text-[10px] text-gray-400 font-black tracking-widest">{res.studentId?.studentId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-300" />
                                            {new Date(res.requestedAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            res.status === 'NOTIFIED' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                                        }`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button type="button" 
                                            onClick={() => handleCancel(res._id)}
                                            className="p-2 text-red-100 hover:text-red-500 transition-colors"
                                            title="Cancel Reservation"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 italic">
                                        No active reservations found for this book.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="p-8 bg-brand-dark rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <AlertCircle className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2">Queue Maintenance</h3>
                    <p className="text-white/60 font-medium max-w-md">
                        Expired notifications are automatically cleared on book return. If a student fails to collect within the hold window, the next student is automatically notified.
                    </p>
                </div>
                <button type="button" className="relative z-10 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10 transition-all active:scale-95">
                    Clear Expired Holds
                </button>
            </div>
        </div>
    );
};

export default StaffReservationManagementPage;
