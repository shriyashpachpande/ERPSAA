import React, { useState, useEffect, useRef } from 'react';
import { History, Activity, Check, X, Clock, Search, MessageSquare, Briefcase, Calendar } from 'lucide-react';
import gsap from 'gsap';
import toast from 'react-hot-toast';

const LeaveRequestsPage = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [remarksModal, setRemarksModal] = useState({ open: false, leaveId: null, action: null, remarks: '' });
    const listRef = useRef(null);

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/leave/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setLeaves(data.data);
            } else {
                toast.error(data.error || 'Failed to fetch leaves.');
            }
        } catch (err) {
            toast.error('Network Error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    useEffect(() => {
        if (!loading && listRef.current && leaves.length > 0) {
            gsap.fromTo(
                listRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
            );
        }
    }, [loading, leaves]);

    const handleActionClick = (leaveId, action) => {
        setRemarksModal({ open: true, leaveId, action, remarks: '' });
    };

    const submitAction = async () => {
        const { leaveId, action, remarks } = remarksModal;
        setActionLoading(leaveId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/leave/status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ leaveId, action, remarks })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Leave ${action} successfully!`);
                fetchLeaves();
                setRemarksModal({ open: false, leaveId: null, action: null, remarks: '' });
            } else {
                toast.error(data.error || `Failed to ${action} leave.`);
            }
        } catch (err) {
            toast.error('Network error.');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusStyle = (stage) => {
        switch (stage) {
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Forwarded to HOD': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen p-6 lg:p-10 text-white relative">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/10">
                    <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
                            <Briefcase className="w-4 h-4" />
                            <span className="dark:text-white text-black">Leave Headquarters</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 dark:text-white text-blue-500">Leave Requests</h1>
                        <p className="text-gray-400 text-lg font-light">Review and process student leave applications</p>
                    </div>

                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl pl-12 pr-5 py-3 w-full md:w-72 outline-none focus:border-primary-500 focus:bg-white/10 shadow-inner transition-all text-sm backdrop-blur-md"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column: Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-200 text-slate-800">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Overview</h3>
                            <div className="space-y-4">
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center transition-all hover:bg-slate-100">
                                    <span className="text-slate-600 font-semibold text-sm">Total Requests</span>
                                    <span className="text-2xl font-black text-slate-800">{leaves.length}</span>
                                </div>
                                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex justify-between items-center transition-all hover:bg-amber-100">
                                    <span className="text-amber-700 font-semibold text-sm">Active Review</span>
                                    <span className="text-2xl font-black text-amber-600">
                                        {leaves.filter(l => l.finalStatus === 'Pending' || l.status === 'Pending').length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 transition-all hover:bg-emerald-100 text-center">
                                        <span className="block text-2xl font-black text-emerald-600 mb-1">
                                            {leaves.filter(l => l.finalStatus === 'Approved').length}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-700">Approved</span>
                                    </div>
                                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 transition-all hover:bg-rose-100 text-center">
                                        <span className="block text-2xl font-black text-rose-600 mb-1">
                                            {leaves.filter(l => l.finalStatus === 'Rejected').length}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-rose-700">Rejected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Listing */}
                    <div className="lg:col-span-3 space-y-5" ref={listRef}>
                        {loading ? (
                            <div className="flex justify-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                                <Activity className="w-8 h-8 animate-spin text-white" />
                            </div>
                        ) : leaves.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
                                <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No Requests Found</h3>
                                <p className="text-gray-400">All caught up! The queue is currently empty.</p>
                            </div>
                        ) : (
                            leaves.map(leave => (
                                <div key={leave._id} className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-xl border border-slate-100 text-slate-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                                        {/* Main Content Area */}
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${getStatusStyle(leave.approvalStage || leave.status)}`}>
                                                    {leave.approvalStage || leave.status}
                                                </span>
                                                {leave.isFlagged && (
                                                    <span className="px-3 py-1 bg-rose-100 border border-rose-200 text-rose-700 rounded-full text-[11px] font-bold tracking-wider flex items-center gap-1.5 uppercase">
                                                        <Activity className="w-3.5 h-3.5" /> High Frequency Flag
                                                    </span>
                                                )}
                                                <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-[11px] font-bold tracking-wider flex items-center gap-1.5 uppercase">
                                                    <Briefcase className="w-3.5 h-3.5" /> {leave.leaveType}
                                                </span>
                                                <span className="text-xs text-slate-400 font-medium ml-auto flex items-center">
                                                    <Calendar className="w-3.5 h-3.5 mr-1" />
                                                    Submitted: {new Date(leave.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-black mb-1.5 text-slate-900 tracking-tight">
                                                {leave.studentId?.personalDetails?.fullName || "Student Record"}
                                            </h3>
                                            <p className="text-sm text-slate-500 font-semibold tracking-wide flex items-center mb-6">
                                                <span className="text-primary-600">{leave.studentId?.studentId || "ID unavailable"}</span>
                                                <span className="mx-2">•</span>
                                                <span>{leave.studentId?.academicProfile?.department || "Department unavailable"}</span>
                                                {leave.studentId?.academicProfile?.course && <><span className="mx-2">•</span> <span>{leave.studentId.academicProfile.course}</span></>}
                                            </p>

                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                                <div className="flex items-center gap-4 text-sm font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-3">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    <span>{new Date(leave.fromDate).toLocaleDateString()}</span>
                                                    <span className="text-slate-400 text-xs uppercase tracking-widest font-black">to</span>
                                                    <span>{new Date(leave.toDate).toLocaleDateString()}</span>
                                                    <span className="bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg text-xs ml-auto">
                                                        {Math.ceil((new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)) + 1} Days
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1.5">Reason provided</span>
                                                    <p className="text-sm text-slate-600 leading-relaxed">"{leave.reason}"</p>
                                                </div>
                                                {leave.isMedical && leave.document && (
                                                    <div className="mt-4 pt-3 border-t border-slate-200">
                                                        <span className="text-xs bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl inline-flex items-center">
                                                            <Activity className="w-3.5 h-3.5 mr-1.5" /> Medical Validation Document Provided
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {leave.remarks && (
                                                <div className="mt-4 flex items-start gap-3 text-sm bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-blue-800">
                                                    <MessageSquare className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                                                    <div>
                                                        <span className="font-bold block mb-0.5 text-xs uppercase tracking-widest text-blue-600">Admin Remarks</span>
                                                        <span className="font-medium">{leave.remarks}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions Area */}
                                        <div className="lg:w-56 flex flex-col justify-center gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6">
                                            {(leave.finalStatus === 'Pending' || leave.status === 'Pending') ? (
                                                <>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-1">Actions</p>

                                                    {leave.approvalStage !== 'Forwarded to HOD' && (
                                                        <button
                                                            disabled={actionLoading === leave._id}
                                                            onClick={() => handleActionClick(leave._id, 'Forwarded to HOD')}
                                                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-5 py-3 rounded-xl font-bold text-xs transition-all active:scale-95"
                                                        >
                                                            Forward to HOD
                                                        </button>
                                                    )}
                                                    <button
                                                        disabled={actionLoading === leave._id}
                                                        onClick={() => handleActionClick(leave._id, 'Approved')}
                                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                                    >
                                                        <Check className="w-4 h-4" /> {leave.approvalStage === 'Forwarded to HOD' ? 'Final Approve' : 'Approve'}
                                                    </button>
                                                    <button
                                                        disabled={actionLoading === leave._id}
                                                        onClick={() => handleActionClick(leave._id, 'Rejected')}
                                                        className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                                    >
                                                        <X className="w-4 h-4" /> Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="text-center p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1">
                                                        <Check size={12} /> Resolved
                                                    </p>
                                                    <p className={`font-black tracking-wide ${leave.finalStatus === 'Approved' ? 'text-emerald-600' : 'text-rose-600'}`}>{leave.finalStatus}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Remarks Modal - Glassmorphic Dark UI exactly as rest of ERP floating modals */}
            {remarksModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300 overflow-hidden text-slate-800">
                        <div className={`h-2 w-full ${remarksModal.action === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <div className="p-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${remarksModal.action === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    {remarksModal.action === 'Approved' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                </div>
                                <h3 className="text-2xl font-black">Confirm {remarksModal.action}</h3>
                            </div>
                            <p className="text-slate-500 font-medium mb-6">You are about to mark this leave request as <strong className="text-slate-800 font-bold">{remarksModal.action.toLowerCase()}</strong>. You can add optional remarks below for the student to see.</p>

                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none shadow-inner"
                                rows="3"
                                placeholder="Add administrative remarks (optional)..."
                                value={remarksModal.remarks}
                                onChange={(e) => setRemarksModal({ ...remarksModal, remarks: e.target.value })}
                            ></textarea>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setRemarksModal({ open: false, leaveId: null, action: null, remarks: '' })}
                                    className="flex-1 py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitAction}
                                    className={`flex-1 py-3.5 px-4 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 ${remarksModal.action === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'}`}
                                >
                                    Confirm Action
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveRequestsPage;
