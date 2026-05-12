import React, { useEffect, useState } from 'react';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, Book as BookIcon, Hash, Timer } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';
import { getMyMasterProfile } from '../../student-master/services/studentMasterService';

const StudentReservationsPage = () => {
    const { getStudentReservations, cancelReservation, loading } = useLibrary();
    const [reservations, setReservations] = useState([]);

    const fetchReservations = async () => {
        try {
            const student = await getMyMasterProfile();
            const res = await getStudentReservations(student.data._id);
            setReservations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
        try {
            await cancelReservation(id);
            fetchReservations();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading && reservations.length === 0) return <div className="p-10 text-center animate-pulse font-bold text-gray-400">Loading your waitlist...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight">My Reservations</h1>
                <p className="text-gray-500 font-medium">Manage your book hold requests and queue status</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {reservations.length > 0 ? (
                    reservations.map(res => (
                        <div key={res._id} className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative group">
                            {/* Visual Indicator of Queue Position */}
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <Hash className="w-32 h-32 -rotate-12" />
                            </div>

                            <div className="flex items-center gap-6 flex-1 min-w-0">
                                <div className={`p-4 rounded-2xl flex-shrink-0 ${
                                    res.status === 'NOTIFIED' ? 'bg-amber-50 text-amber-600 animate-pulse' : 
                                    res.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'
                                }`}>
                                    <Clock className="w-6 h-6" />
                                </div>
                                
                                <div className="min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                            res.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                            res.status === 'NOTIFIED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                            res.status === 'COLLECTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                        }`}>
                                            {res.status}
                                        </span>
                                        {res.status === 'ACTIVE' && (
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                                Position: <span className="text-indigo-600 text-xs">#{res.queuePosition}</span>
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-black text-brand-dark text-lg truncate pr-10">{res.bookId.title}</h3>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-bold text-gray-400">
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            <span>Requested: {new Date(res.requestedAt).toLocaleDateString()}</span>
                                        </div>
                                        {res.expiresAt && (
                                            <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                                                <Timer className="w-3 h-3 mr-1" />
                                                <span>Pick up by: {new Date(res.expiresAt).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
                                {res.status === 'NOTIFIED' && (
                                    <div className="flex-1 md:flex-none px-6 py-3 bg-amber-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30">
                                        <AlertCircle className="w-4 h-4" />
                                        Ready for Collection
                                    </div>
                                )}
                                
                                {(res.status === 'ACTIVE' || res.status === 'NOTIFIED') && (
                                    <button 
                                        onClick={() => handleCancel(res._id)}
                                        className="p-3 bg-white border border-gray-200 rounded-xl text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm flex items-center gap-2 font-bold text-xs"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-indigo-50/20 rounded-[3rem] border-2 border-dashed border-indigo-100">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-6 translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                            <BookIcon className="w-10 h-10 text-indigo-300" />
                        </div>
                        <h3 className="text-2xl font-black text-brand-dark">No active reservations</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-2 font-medium">Reserved books will appear here when copies are unavailable.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentReservationsPage;
