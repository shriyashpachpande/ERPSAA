import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Clock, Book as BookIcon, Receipt, ArrowLeft, Loader2, IndianRupee, Hash, ChevronRight, Info, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLibrary from '../hooks/useLibrary';
import { getMyMasterProfile } from '../../student-master/services/studentMasterService';
import gsap from 'gsap';

const StudentFinePage = () => {
    const navigate = useNavigate();
    const { getFines, loading } = useLibrary();
    const [fines, setFines] = useState([]);
    const [stats, setStats] = useState({ total: 0, unpaid: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const fetchFines = async () => {
            try {
                const student = await getMyMasterProfile();
                if (isMounted) {
                    const res = await getFines(student.data._id);
                    if (res.success) {
                        setFines(res.data);
                        const unpaid = res.data
                            .filter(f => f.status === 'UNPAID' || f.status === 'PARTIAL')
                            .reduce((sum, f) => sum + f.remainingAmount, 0);
                        setStats({ total: res.data.length, unpaid });
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchFines();
        return () => { isMounted = false; };
    }, []);

    useLayoutEffect(() => {
        if (!loading && containerRef.current) {
            const ctx = gsap.context(() => {
                const items = containerRef.current.querySelectorAll('.stagger-item');
                if (items.length > 0) {
                    gsap.fromTo(items,
                        { x: 100, opacity: 0 },
                        {
                            x: 0,
                            opacity: 1,
                            duration: 0.8,
                            stagger: 0.08,
                            ease: "power4.out",
                            clearProps: "all"
                        }
                    );
                }
            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading, fines]);

    const getStatusTheme = (status) => {
        switch (status) {
            case 'PAID': return { color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Settled' };
            case 'UNPAID': return { color: '#EF4444', bg: 'bg-rose-50', border: 'border-rose-200', label: 'Due' };
            case 'PARTIAL': return { color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Partial' };
            case 'WAIVED': return { color: '#6366F1', bg: 'bg-indigo-50', border: 'border-indigo-200', label: 'Waived' };
            default: return { color: '#64748B', bg: 'bg-slate-50', border: 'border-slate-200', label: status };
        }
    };

    if (loading && fines.length === 0) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-50 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                <IndianRupee className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Calculating Dues</p>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FDFDFF] pb-32 p-4 md:p-10">
            {/* Header with Balance Card */}
            <div className="max-w-6xl mx-auto mb-16 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 stagger-item">
                    <div className="flex items-center gap-6">
                        <button type="button"
                            onClick={() => navigate(-1)}
                            className="group p-4 bg-white rounded-3xl shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all duration-500"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Fine Ledger</h1>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 flex items-center gap-3">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                Institutional Penalty Tracking
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[3rem] shadow-[0px_0px_10px_2px_rgba(239,68,68,0.2),0px_0px_20px_8px_rgba(239,68,68,0.1)] border border-red-50 flex items-center gap-6 group hover:shadow-[0_0_25px_0px_rgba(239,68,68,0.4)] transition-all duration-500">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 border border-red-100 group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-1">Outstanding Balance</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-black text-red-600">₹</span>
                                <span className="text-3xl font-black text-red-600 tracking-tighter">{stats.unpaid}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto space-y-8">
                {fines.length > 0 ? (
                    fines.map((fine) => {
                        const theme = getStatusTheme(fine.status);
                        return (
                            <div
                                key={fine._id}
                                className="stagger-item group relative bg-white rounded-[3.5rem] border border-slate-100 p-8 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all duration-500 flex flex-col lg:flex-row items-center gap-10 overflow-hidden"
                            >
                                {/* Aurora Accent */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

                                {/* Receipt Icon Pod */}
                                <div className="w-20 h-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-all duration-500 flex-shrink-0 shadow-sm">
                                    <Receipt className="w-10 h-10 text-slate-200 group-hover:text-blue-500 transition-colors" />
                                    <div className={`absolute bottom-0 inset-x-0 h-1.5`} style={{ backgroundColor: theme.color }}></div>
                                </div>

                                {/* Information Area */}
                                <div className="flex-1 space-y-4 text-center lg:text-left">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                                        <div className={`w-fit mx-auto lg:mx-0 px-4 py-1.5 rounded-xl border-2 ${theme.bg} ${theme.border} flex items-center gap-2 shadow-sm`}>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.color }}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.color }}>{theme.label}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Token #{fine.fineId}</span>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                            {fine.bookId?.title || 'System Penalty'}
                                        </h3>
                                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                <Info className="w-3.5 h-3.5 text-blue-400" />
                                                <span>{fine.fineType}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                                                <span>Raised: {new Date(fine.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {fine.waiverReason && (
                                        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
                                            <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5" />
                                            <p className="text-xs font-bold text-indigo-600 italic leading-relaxed">Waiver Note: {fine.waiverReason}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Financial Breakdown Card */}
                                <div className="w-full lg:w-auto bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 grid grid-cols-3 gap-8 shadow-inner group-hover:bg-white group-hover:border-blue-100 transition-all duration-500">
                                    <div className="text-center">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Total</span>
                                        <p className="text-lg font-black text-slate-800 tracking-tighter">₹{fine.amount}</p>
                                    </div>
                                    <div className="text-center border-x border-slate-200 px-8">
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-2">Paid</span>
                                        <p className="text-lg font-black text-emerald-600 tracking-tighter">₹{fine.paidAmount}</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block mb-2">Due</span>
                                        <p className="text-lg font-black text-red-600 tracking-tighter">₹{fine.remainingAmount}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="stagger-item py-40 text-center bg-white rounded-[5rem] border border-slate-100 shadow-[0px_0px_10px_2px_rgba(16,185,129,0.2),0px_0px_20px_8px_rgba(16,185,129,0.1)] flex flex-col items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 to-transparent"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-10 border border-emerald-50 shadow-xl group-hover:scale-110 transition-transform duration-700">
                                <CheckCircle className="w-14 h-14 text-emerald-500" />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Record Crystal Clear</h3>
                            <p className="text-slate-400 font-bold max-w-sm mx-auto uppercase tracking-[0.25em] text-[10px] leading-[2.5]">
                                No overdue penalties or damage records detected. Your library account is in perfect standing.
                            </p>
                            <div className="mt-12 flex items-center gap-3 bg-emerald-50 px-8 py-3 rounded-2xl border border-emerald-100">
                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Excellent Standing</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentFinePage;
