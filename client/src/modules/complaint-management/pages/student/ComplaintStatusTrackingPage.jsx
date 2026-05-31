import React, { useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Clock, Info, ExternalLink, Activity, User, Calendar, 
    Sparkles, ShieldCheck, ArrowRight, Bell, Target, Zap, ArrowLeft 
} from 'lucide-react';
import { useComplaintDetails } from '../../../../hooks/complaint-management/useComplaintDetails';
import { COMPLAINT_STATUS_UI } from '../../../../constants/complaint-management/complaintStatusUiConstants';
import { COMPLAINT_PRIORITY_UI } from '../../../../constants/complaint-management/complaintPriorityUiConstants';
import ComplaintTimeline from '../../../../components/complaint-management/timeline/ComplaintTimeline';
import gsap from 'gsap';

const ComplaintStatusTrackingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { complaint, timeline, loading } = useComplaintDetails(id);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        if (!loading && complaint && containerRef.current) {
            const ctx = gsap.context(() => {
                const items = containerRef.current.querySelectorAll('.stagger-item');
                if (items.length > 0) {
                    gsap.fromTo(items, 
                        { x: 100, opacity: 0 },
                        { 
                            x: 0, 
                            opacity: 1, 
                            duration: 1, 
                            stagger: 0.1, 
                            ease: "power4.out",
                            clearProps: "all" 
                        }
                    );
                }
            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading, complaint]);

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-50 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                <Activity className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Calibrating Tracking Node</p>
        </div>
    );

    if (!complaint) return (
        <div className="min-h-screen flex items-center justify-center p-12 bg-transparent">
            <div className="text-center stagger-item">
                <div className="p-10 bg-rose-50 text-rose-500 rounded-[3rem] inline-block mb-10 border-2 border-rose-100 shadow-xl shadow-rose-100/50">
                    <ShieldCheck size={64} className="animate-pulse" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Terminal Disconnected</h2>
                <p className="text-slate-400 font-bold mt-4 max-w-sm mx-auto uppercase tracking-widest text-[10px]">The requested ticket is invalid or access was denied.</p>
                <button type="button" 
                    onClick={() => navigate('/app/student/complaints/my')}
                    className="mt-12 px-12 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all duration-500 shadow-2xl active:scale-95 flex items-center gap-4 mx-auto"
                >
                    <ArrowLeft size={20} />
                    RETURN TO LEDGER
                </button>
            </div>
        </div>
    );

    const statusInfo = COMPLAINT_STATUS_UI[complaint.status] || { label: complaint.status, color: 'bg-slate-100 text-slate-600' };

    return (
        <div ref={containerRef} className="min-h-screen bg-transparent pb-32 p-4 md:p-10 overflow-hidden">
            {/* 1. ELITE HEADER */}
            <div className="max-w-7xl mx-auto mb-16 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 stagger-item">
                    <div className="flex items-center gap-6">
                        <button type="button"
                            onClick={() => navigate('/app/student/complaints/my')}
                            className="group p-4 bg-white rounded-3xl shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all duration-500"
                        >
                            <ChevronLeft size={24} className="text-slate-600 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2">
                                <Activity size={14} className="animate-pulse" />
                                Real-Time Resolution Hub
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Status Terminal</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-3 rounded-[2rem] border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3 px-6 py-2 bg-blue-50 rounded-2xl border border-blue-100">
                            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Live Monitoring Active</span>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT: PROGRESS HUB */}
                    <div className="lg:col-span-8 space-y-10 stagger-item">
                        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_0px_rgba(139,92,246,0.4)] transition-all duration-700 border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full -mr-40 -mt-40 blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                            
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 group-hover:rotate-12 transition-transform">
                                            <Bell size={20} />
                                        </div>
                                        <span className="font-mono text-sm font-black text-blue-600 tracking-tighter">
                                            TICKET: {complaint.complaintCode}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                                        {complaint.title}
                                    </h1>
                                </div>
                                <div className="shrink-0">
                                    <div className={`px-10 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest border-2 shadow-sm ${statusInfo.color} flex items-center gap-3`}>
                                        <Target size={16} />
                                        {statusInfo.label}
                                    </div>
                                </div>
                            </div>

                            {/* Status Executive Summary */}
                            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 mb-12 group-hover:bg-white transition-colors duration-500 shadow-inner">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                    <Info size={14} className="text-blue-500" /> Resolution Context
                                </h3>
                                <p className="text-slate-700 font-bold text-sm leading-loose">
                                    Current Tier: <span className="text-blue-600 uppercase font-black tracking-widest text-[10px] ml-1 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{statusInfo.label}</span>
                                    <br />
                                    <span className="mt-4 block opacity-70">
                                        {complaint.status === 'submitted' && "System analysis is active. Our triage officers are reviewing the operational impact of your report."}
                                        {complaint.status === 'in_progress' && "Dedicated resource allocation completed. An expert is currently executing the resolution protocol."}
                                        {complaint.status === 'resolved' && "Operational restoration complete. Please verify the resolution and finalize the ticket audit."}
                                    </span>
                                </p>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="space-y-10">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200">
                                        <Activity size={22} />
                                    </div>
                                    Audit Timeline
                                </h2>
                                <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-50 group-hover:bg-white transition-all duration-500">
                                    <ComplaintTimeline timeline={timeline} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: METADATA PANELS */}
                    <div className="lg:col-span-4 space-y-10 stagger-item">
                        {/* EXECUTIVE TICKET INFO */}
                        <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800 group hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-700">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-blue-600/30 transition-colors" />
                            
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10">Operational Protocol</h4>
                            
                            <div className="space-y-10">
                                {[
                                    { icon: LayoutGrid, color: 'text-blue-400', label: 'Category', value: complaint.category },
                                    { icon: Zap, color: 'text-amber-400', label: 'Priority', value: complaint.priority, highlight: COMPLAINT_PRIORITY_UI[complaint.priority]?.color },
                                    { icon: User, color: 'text-emerald-400', label: 'Assigned Officer', value: complaint.assignedTo?.fullName || complaint.assignedRole || 'System Allocation...' },
                                    { icon: Calendar, color: 'text-purple-400', label: 'Last Update', value: new Date(complaint.updatedAt).toLocaleDateString() }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-6 group/item">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover/item:bg-white/10 transition-all duration-500 group-hover/item:scale-110">
                                            <item.icon size={20} className={item.color} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className={`text-sm font-black truncate capitalize ${item.highlight || 'text-slate-200'}`}>{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/5">
                                <button type="button" 
                                    onClick={() => navigate(`/app/student/complaints/details/${id}`)}
                                    className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-white/5 active:scale-95 group/btn"
                                >
                                    <ExternalLink size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    FULL AUDIT REPORT
                                </button>
                                <p className="text-[9px] text-center text-slate-500 font-black mt-6 uppercase tracking-widest opacity-60">
                                    Secure Data Transmission Active
                                </p>
                            </div>
                        </div>

                        {/* HELP CENTER TIER */}
                        <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white shadow-2xl shadow-blue-200/50 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 text-center space-y-6">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-xl border border-white/20 group-hover:rotate-12 transition-transform duration-700">
                                    <ShieldCheck size={32} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black mb-2 tracking-tight">Technical Support</h4>
                                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                                        Urgent escalation required?<br />Direct Node Access
                                    </p>
                                </div>
                                <div className="py-3 px-6 bg-white/20 rounded-2xl text-[10px] font-black border border-white/30 tracking-[0.3em]">
                                    SUPPORT ID: ST-PRO-001
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ComplaintStatusTrackingPage;
