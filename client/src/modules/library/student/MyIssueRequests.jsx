import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
    Clock,
    CheckCircle,
    XCircle,
    Book as BookIcon,
    AlertCircle,
    ArrowLeft,
    Loader2,
    Calendar,
    ArrowUpRight,
    User,
    Hash,
    ChevronRight,
    Info,
    LayoutGrid,
    Search,
    Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLibrary from '../hooks/useLibrary';
import gsap from 'gsap';

const MyIssueRequests = () => {
    const navigate = useNavigate();
    const { getStudentIssueRequests } = useLibrary();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const studentRes = await fetch('/api/student-master/me', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.json());

                if (isMounted && studentRes.success) {
                    const res = await getStudentIssueRequests(studentRes.data._id);
                    if (res.success) {
                        setRequests(res.data);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchRequests();
        return () => { isMounted = false; };
    }, []);

    useLayoutEffect(() => {
        if (!loading && containerRef.current) {
            const ctx = gsap.context(() => {
                const items = containerRef.current.querySelectorAll('.stagger-item');
                if (items.length > 0) {
                    gsap.fromTo(items,
                        { x: 100, opacity: 0, rotateY: 15 },
                        {
                            x: 0,
                            opacity: 1,
                            rotateY: 0,
                            duration: 1,
                            stagger: 0.1,
                            ease: "elastic.out(1, 0.75)",
                            clearProps: "all"
                        }
                    );
                }
            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading, requests]);

    const getStatusTheme = (status) => {
        switch (status) {
            case 'PENDING': return { icon: Clock, label: 'Pending', color: '#F59E0B', shadow: 'rgba(245, 158, 11, 0.3)', bg: 'bg-amber-500' };
            case 'APPROVED': return { icon: CheckCircle, label: 'Approved', color: '#10B981', shadow: 'rgba(16, 185, 129, 0.3)', bg: 'bg-emerald-500' };
            case 'REJECTED': return { icon: XCircle, label: 'Rejected', color: '#EF4444', shadow: 'rgba(239, 68, 68, 0.3)', bg: 'bg-rose-500' };
            default: return { icon: Info, label: status, color: '#3B82F6', shadow: 'rgba(59, 130, 246, 0.3)', bg: 'bg-blue-500' };
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <BookIcon className="absolute inset-0 m-auto w-8 h-8 text-blue-500 animate-pulse" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Decrypting Ledger</p>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FDFDFF] pb-32">
            {/* 1. CINEMATIC TOP NAV */}
            <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 px-6 py-6 stagger-item">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="group p-4 bg-white rounded-3xl shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all duration-500"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Borrow Requests</h1>
                            <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mt-2">Personal Acquisition Queue</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <LayoutGrid className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{requests.length} Requests Found</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-12">
                {requests.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {requests.map((req) => {
                            const theme = getStatusTheme(req.status);
                            return (
                                <div
                                    key={req._id}
                                    className="stagger-item group relative bg-white rounded-[3.5rem] border border-slate-100 p-8 md:p-10 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] hover:-translate-y-3 transition-all duration-700 cursor-pointer overflow-hidden"
                                    onClick={() => navigate(`/app/student/library/catalog/${req.bookId?._id}`)}
                                >
                                    {/* Abstract Aurora Background Layer */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full -ml-16 -mb-16 blur-3xl group-hover:bg-purple-500/10 transition-colors duration-700"></div>

                                    {/* Status Vertical Bar */}
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-20 rounded-r-full ${theme.bg} opacity-50 group-hover:h-32 transition-all duration-500`}></div>

                                    <div className="flex flex-col md:flex-row gap-10 relative z-10">
                                        {/* Book Cover Visualization */}
                                        <div className="w-full md:w-32 h-44 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm overflow-hidden flex-shrink-0 group-hover:shadow-lg group-hover:scale-105 transition-all duration-700 relative">
                                            {req.bookId?.coverImage ? (
                                                <img src={req.bookId.coverImage} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-200">
                                                    <BookIcon className="w-12 h-12" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 space-y-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 leading-[1.1] tracking-tight group-hover:text-blue-600 transition-colors duration-500">
                                                        {req.bookId?.title || 'Unknown Title'}
                                                    </h3>
                                                    <p className="text-sm font-bold text-slate-400 mt-2 flex items-center gap-2 uppercase tracking-wide">
                                                        <User className="w-3.5 h-3.5 text-blue-500" />
                                                        {req.bookId?.author || 'Unknown Author'}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500" style={{ backgroundColor: `${theme.color}15`, border: `1px solid ${theme.color}30` }}>
                                                        <theme.icon className="w-6 h-6" style={{ color: theme.color }} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.color }}>{theme.label}</span>
                                                </div>
                                            </div>

                                            <div className="h-px bg-slate-100/70 w-full"></div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Hash className="w-3 h-3 text-blue-400" />
                                                        Request Token
                                                    </span>
                                                    <p className="text-sm font-black text-slate-800">{req.requestId}</p>
                                                </div>
                                                <div className="space-y-1 text-right">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-end gap-2">
                                                        <Calendar className="w-3 h-3 text-purple-400" />
                                                        Timestamp
                                                    </span>
                                                    <p className="text-sm font-black text-slate-800">{new Date(req.requestDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {/* Modern Interaction Bar */}
                                            <div className="pt-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Awaiting Staff</span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                                    Explore <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="stagger-item py-40 text-center bg-white rounded-[5rem] border border-slate-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-10 border border-slate-100 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                                <BookIcon className="w-12 h-12 text-slate-200" />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Your Catalog is Silent</h3>
                            <p className="text-slate-400 font-bold max-w-sm mx-auto uppercase tracking-[0.25em] text-[10px] leading-[2.5]">
                                No active petitions detected in our servers. Start your intellectual journey today.
                            </p>
                            <button
                                onClick={() => navigate('/app/student/library/catalog')}
                                className="mt-14 px-12 py-6 bg-brand-dark text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 transition-all duration-500 active:scale-95 flex items-center gap-6 shadow-2xl shadow-brand-dark/20 hover:shadow-blue-500/40 group"
                            >
                                Enter Catalog
                                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Float Decor */}
            <div className="fixed bottom-10 right-10 z-50 pointer-events-none opacity-20">
                <BookIcon className="w-40 h-40 text-slate-100 rotate-12" />
            </div>
        </div>
    );
};

export default MyIssueRequests;
