import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import {
    History,
    Book as BookIcon,
    CheckCircle,
    ArrowUpRight,
    Hash,
    ArrowLeft,
    Loader2,
    Calendar,
    Clock,
    Search,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLibrary from '../hooks/useLibrary';
import gsap from 'gsap';

const LibraryHistory = () => {
    const navigate = useNavigate();
    const { getStudentBooks } = useLibrary();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const studentRes = await fetch(`/api/student-master/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.json());

                if (isMounted && studentRes.success) {
                    const res = await getStudentBooks(studentRes.data._id);
                    if (res.success) {
                        setHistory(res.data.filter(t => t.status === 'RETURNED').sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate)));
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchHistory();
        return () => { isMounted = false; };
    }, []);

    useLayoutEffect(() => {
        if (!loading && containerRef.current) {
            const ctx = gsap.context(() => {
                const items = containerRef.current.querySelectorAll('.stagger-item');
                if (items.length > 0) {
                    gsap.fromTo(items,
                        { x: 80, opacity: 0 },
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
    }, [loading, history]);

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-50 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                <History className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Auditing Archives</p>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FDFDFF] pb-32 p-4 md:p-10">
            {/* 1. ELITE HEADER */}
            <div className="max-w-6xl mx-auto mb-16 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 stagger-item">
                    <div className="flex items-center gap-6">
                        <button type="button"
                            onClick={() => navigate(-1)}
                            className="group p-4 bg-white rounded-3xl shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all duration-500"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Return Archives</h1>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 flex items-center gap-3">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                History of Knowledge Exchange
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-3 rounded-[2.5rem] shadow-[0px_0px_10px_2px_rgba(59,130,246,0.1)] border border-slate-50">
                        <div className="flex items-center gap-3 px-6 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{history.length} Books Returned</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto space-y-6">
                {history.length > 0 ? (
                    history.map((item) => (
                        <div
                            key={item._id}
                            className="stagger-item group relative bg-white rounded-[3rem] border border-slate-100 p-8 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-center gap-10"
                        >
                            {/* Visual Ornament */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-700"></div>

                            {/* Book Visualization */}
                            <div className="w-24 h-32 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-sm">
                                {item.bookId?.coverImage ? (
                                    <img src={item.bookId.coverImage} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <BookIcon className="w-10 h-10 text-slate-200" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-500">
                                        {item.bookId?.title || 'Unknown Publication'}
                                    </h3>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                        by {item.bookId?.author || 'Unknown Author'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        <Hash className="w-3 h-3 text-blue-400" />
                                        ID: {item.transactionId || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        <History className="w-3 h-3 text-emerald-400" />
                                        Status: Returned
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Component */}
                            <div className="flex items-center gap-8 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all duration-500 shadow-inner">
                                <div className="text-center">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Issued</span>
                                    <p className="text-sm font-black text-slate-800">{new Date(item.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-px bg-slate-200 group-hover:bg-blue-200 transition-colors"></div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
                                </div>
                                <div className="text-center">
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Returned</span>
                                    <p className="text-sm font-black text-emerald-700">{new Date(item.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>

                            {/* Hover Action */}
                            <div className="absolute right-10 bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 cursor-pointer flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-widest" onClick={() => navigate(`/app/student/library/catalog/${item.bookId?._id}`)}>
                                Catalog <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="stagger-item py-40 text-center bg-white rounded-[5rem] border border-slate-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-10 border border-slate-100 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                            <History className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">History is a Clean Slate</h3>
                        <p className="text-slate-400 font-bold max-w-sm mx-auto uppercase tracking-[0.25em] text-[10px] leading-[2.5]">
                            You haven't completed any book cycles yet. Borrowed books will appear here once returned.
                        </p>
                        <button type="button"
                            onClick={() => navigate('/app/student/library/catalog')}
                            className="mt-14 px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 transition-all duration-500 active:scale-95 flex items-center gap-6 shadow-2xl shadow-brand-dark/20 hover:shadow-blue-500/40"
                        >
                            Begin Journey
                            <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LibraryHistory;
