import React, { useState, useEffect, useRef } from 'react';
import { History, FileText, Activity, Search, Calendar } from 'lucide-react';
import gsap from 'gsap';
import toast from 'react-hot-toast';

const StudentLeaveHistoryPage = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const listRef = useRef(null);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/leave/student', {
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
        fetchLeaves();
    }, []);

    useEffect(() => {
        if (!loading && listRef.current && leaves.length > 0) {
            gsap.fromTo(
                listRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, [loading, leaves]);

    const getStatusStyle = (leave) => {
        const stage = leave.approvalStage || leave.status;
        switch (stage) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'Faculty Reviewed': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Forwarded to HOD': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen p-6 lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-xl rounded-bl-2xl border-l border-slate-200" style={{ boxShadow: "0 0 20px 0px rgba(239, 68, 68, 0.3)" }}>
            {/* Dynamic Light Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/10 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none -mb-20 -ml-20"></div>

            <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-primary-100 shadow-sm">
                            <History className="w-3.5 h-3.5" />
                            <span>Leave Management</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-slate-900">My Leaves</h1>
                        <p className="text-slate-500 text-lg font-medium">Track the status of your past and current leave requests</p>
                    </div>

                    <div className="relative group">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3 w-full md:w-72 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 hover:border-primary-300 transition-all text-sm font-semibold text-slate-800 shadow-sm"
                        />
                    </div>
                </header>

                <div className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-6 lg:p-10 shadow-xl shadow-slate-200/40 backdrop-blur-xl"
                    style={{ boxShadow: "0 0 20px 0px rgba(16, 185, 129, 0.34)" }}
                >
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Activity className="w-8 h-8 animate-spin text-primary-500" />
                        </div>
                    ) : (
                        leaves.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">No Leave Applications Found</h3>
                                <p className="text-slate-500 text-sm font-medium">You haven't requested any leaves yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4" ref={listRef}>
                                {leaves.map(leave => (
                                    <div key={leave._id} className="group bg-white border border-slate-200 hover:border-primary-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-md" style={{ boxShadow: "0 0 20px 0px rgba(138, 92, 246, 0.41)" }}>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shrink-0 group-hover:scale-105 group-hover:bg-primary-50 group-hover:border-primary-100 transition-all">
                                                <Calendar className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-sm font-black text-slate-900 tracking-wide">{leave.leaveType} Leave</h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(leave)}`}>
                                                        {leave.approvalStage || leave.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-bold mb-2">
                                                    {new Date(leave.fromDate).toLocaleDateString()} — {new Date(leave.toDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-slate-600 font-medium line-clamp-2 md:line-clamp-1">
                                                    "{leave.reason}"
                                                </p>
                                                {leave.remarks && (
                                                    <div className="mt-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">
                                                        <span className="font-black text-slate-900">Remarks: </span> {leave.remarks}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentLeaveHistoryPage;
