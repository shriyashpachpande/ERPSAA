import React, { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListChecks, Plus, ArrowLeft, Loader2, Sparkles, LayoutGrid, ShieldCheck, Info } from 'lucide-react';
import { useStudentComplaintList } from '../../../../hooks/complaint-management/useStudentComplaintList';
import ComplaintTable from '../../../../components/complaint-management/tables/ComplaintTable';
import gsap from 'gsap';

const MyComplaintsPage = () => {
    const navigate = useNavigate();
    const { complaints, loading, error } = useStudentComplaintList();
    const containerRef = useRef(null);

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
    }, [loading, complaints]);

    const handleView = (id) => {
        navigate(`/app/student/complaints/details/${id}`);
    };

    const handleTrack = (id) => {
        navigate(`/app/student/complaints/status/${id}`);
    };

    const stats = {
        total: complaints?.length || 0,
        pending: complaints?.filter(c => c.status === 'PENDING').length || 0,
        resolved: complaints?.filter(c => c.status === 'RESOLVED').length || 0
    };

    if (loading && !complaints) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-50 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                <ListChecks className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Resolution Hub</p>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-transparent pb-32 p-4 md:p-10">
            {/* 1. ELITE HEADER */}
            <div className="max-w-7xl mx-auto mb-12 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 stagger-item">
                    <div className="flex items-center gap-6">
                        <button type="button"
                            onClick={() => navigate(-1)}
                            className="group p-4 bg-white rounded-3xl shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all duration-500"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2">
                                <Sparkles size={14} className="animate-pulse" />
                                Institutional Triage System
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support Ledger</h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-[2.5rem] border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3 px-6 py-2 bg-blue-50 rounded-2xl border border-blue-100">
                            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Total: {stats.total}</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-2 bg-amber-50 rounded-2xl border border-amber-100">
                            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Pending: {stats.pending}</span>
                        </div>
                        <button type="button"
                            onClick={() => navigate('/app/student/complaints/raise')}
                            className="flex items-center justify-center gap-3 px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all duration-500 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] active:scale-95"
                        >
                            <Plus size={18} />
                            New Complaint
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto stagger-item">
                <div className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_0px_rgba(139,92,246,0.4)] transition-all duration-700 border border-slate-100 overflow-hidden relative group">
                    {/* Glass Accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                    
                    {error && (
                        <div className="mb-10 p-6 bg-rose-50 text-rose-600 rounded-3xl border-2 border-rose-100 text-sm font-black flex items-center gap-4">
                            <Info className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                    
                    <div className="relative z-10">
                        <ComplaintTable 
                            complaints={complaints} 
                            onView={handleView} 
                            onTrack={handleTrack}
                            isLoading={loading} 
                        />
                    </div>
                </div>

                {/* Bottom Tip */}
                <div className="mt-12 flex items-center justify-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] stagger-item">
                    <ShieldCheck size={16} className="text-blue-500" />
                    Secure Resolution Hub v1.0
                </div>
            </main>
        </div>
    );
};

export default MyComplaintsPage;
