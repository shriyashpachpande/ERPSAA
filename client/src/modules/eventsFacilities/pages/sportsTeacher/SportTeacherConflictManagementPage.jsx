import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Clock, User, ArrowRight, RefreshCw, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const SportTeacherConflictManagementPage = () => {
    const [conflicts, setConflicts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchConflicts();
    }, [date]);

    const fetchConflicts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/eventsFacilities/management/conflicts?date=${date}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setConflicts(data.data);
            }
        } catch (err) {
            toast.error("Failed to load conflicts");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        setActionLoading(id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/eventsFacilities/management/requests/${id}/${action}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Request ${action}d`);
                fetchConflicts();
            } else {
                toast.error(data.message || "Action failed");
            }
        } catch (err) {
            toast.error("Network error");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-2xl border-l border-slate-200">
            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-slate-900">Conflict Management</h1>
                        <p className="text-slate-500 text-lg font-medium">Identify and resolve booking overlaps across facilities.</p>
                    </div>
                    <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm items-center gap-3">
                        <Filter className="w-4 h-4 text-slate-400 ml-2" />
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent border-none font-bold text-slate-700 outline-none"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Conflicts</p>
                        <h4 className="text-3xl font-black text-slate-900">{conflicts.length}</h4>
                    </div>
                    <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 shadow-sm">
                        <p className="text-xs font-black text-rose-400 uppercase tracking-widest mb-1">High Risk</p>
                        <h4 className="text-3xl font-black text-rose-600">{conflicts.filter(c => c.conflictType === 'Approved-Overlap').length}</h4>
                    </div>
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-sm">
                        <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Double Pending</p>
                        <h4 className="text-3xl font-black text-amber-600">{conflicts.filter(c => c.conflictType === 'Double-Pending').length}</h4>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
                        <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Daily Checks</p>
                        <h4 className="text-3xl font-black text-emerald-600">Active</h4>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : conflicts.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-sm">
                        <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">All Clear!</h3>
                        <p className="text-slate-500">No overlapping requests found for the selected date.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {conflicts.map((conflict, idx) => (
                            <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                                    <div className="flex items-center gap-2 font-black text-slate-600 text-sm uppercase tracking-wider">
                                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                                        {conflict.facility} • {new Date(conflict.date).toLocaleDateString()}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        conflict.conflictType === 'Approved-Overlap' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {conflict.conflictType}
                                    </span>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
                                    {/* Middle VS Badge */}
                                    <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full items-center justify-center font-black text-xs text-slate-400 z-10 shadow-sm">
                                        VS
                                    </div>

                                    {/* Request 1 */}
                                    <div className={`p-5 rounded-2xl border ${conflict.request1.status === 'approved' ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <User className="w-4 h-4 text-slate-600" />
                                                </div>
                                                <p className="font-bold text-slate-900">{conflict.request1.student}</p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                                conflict.request1.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                                            }`}>
                                                {conflict.request1.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-slate-600 text-sm">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            {conflict.request1.time}
                                        </div>
                                        {conflict.request1.status === 'pending' && (
                                            <div className="mt-4 flex gap-2">
                                                <button 
                                                    onClick={() => handleAction(conflict.request1.id, 'approve')}
                                                    disabled={!!actionLoading}
                                                    className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors active:scale-95 disabled:opacity-50"
                                                >
                                                    {actionLoading === conflict.request1.id ? <RefreshCw className="w-3 h-3 animate-spin mx-auto"/> : 'Approve'}
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(conflict.request1.id, 'reject')}
                                                    disabled={!!actionLoading}
                                                    className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg text-xs font-bold transition-colors active:scale-95 disabled:opacity-50"
                                                >
                                                    {actionLoading === conflict.request1.id ? <RefreshCw className="w-3 h-3 animate-spin mx-auto"/> : 'Reject'}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Request 2 */}
                                    <div className={`p-5 rounded-2xl border ${conflict.request2.status === 'approved' ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <User className="w-4 h-4 text-slate-600" />
                                                </div>
                                                <p className="font-bold text-slate-900">{conflict.request2.student}</p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                                conflict.request2.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                                            }`}>
                                                {conflict.request2.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-slate-600 text-sm">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            {conflict.request2.time}
                                        </div>
                                        {conflict.request2.status === 'pending' && (
                                            <div className="mt-4 flex gap-2">
                                                <button 
                                                    onClick={() => handleAction(conflict.request2.id, 'approve')}
                                                    disabled={!!actionLoading}
                                                    className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors active:scale-95 disabled:opacity-50"
                                                >
                                                    {actionLoading === conflict.request2.id ? <RefreshCw className="w-3 h-3 animate-spin mx-auto"/> : 'Approve'}
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(conflict.request2.id, 'reject')}
                                                    disabled={!!actionLoading}
                                                    className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg text-xs font-bold transition-colors active:scale-95 disabled:opacity-50"
                                                >
                                                    {actionLoading === conflict.request2.id ? <RefreshCw className="w-3 h-3 animate-spin mx-auto"/> : 'Reject'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SportTeacherConflictManagementPage;
