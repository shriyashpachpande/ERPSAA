import React, { useState, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MessageSquarePlus, ChevronLeft, CheckCircle, Sparkles, ShieldCheck, Clock, ArrowRight, HelpCircle } from 'lucide-react';
import ComplaintForm from '../../../../components/complaint-management/forms/ComplaintForm';
import complaintManagementApi from '../../../../api/complaint-management/complaintManagementApi';
import gsap from 'gsap';

const RaiseComplaintPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
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
    }, []);

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            const res = await complaintManagementApi.createComplaint(formData);
            if (res.data.success) {
                toast.success('Complaint submitted successfully!');
                navigate('/app/student/complaints/my');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FDFDFF] relative overflow-hidden pb-24 bg-transparent">
            {/* 1. CINEMATIC BACKGROUND ORBS */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-blue-600/10 via-indigo-400/5 to-transparent -z-10 blur-[120px]" />
            <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full -z-10 blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full -z-10 blur-[100px]" />

            <div className="max-w-7xl mx-auto p-4 md:p-10 relative z-10">
                {/* 2. ELITE HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 stagger-item">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="group p-4 bg-white rounded-3xl shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all duration-500"
                        >
                            <ChevronLeft size={24} className="text-slate-600 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2">
                                <Sparkles size={14} className="animate-spin-slow" />
                                Institutional Support Protocol
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                                Resolution <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Terminal</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-3 rounded-[2rem] border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3 px-6 py-2 bg-blue-50 rounded-2xl border border-blue-100">
                            <ShieldCheck className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Secure Submission</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* 3. PRIMARY FORM CONTAINER */}
                    <div className="lg:col-span-8 stagger-item">
                        <div className="bg-white rounded-[3.5rem] p-1 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_0px_rgba(139,92,246,0.4)] transition-all duration-700 overflow-hidden group">
                            <div className="bg-white rounded-[3.2rem] p-8 md:p-12 relative overflow-hidden">
                                {/* Form Inner Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:bg-blue-100 transition-colors"></div>
                                <ComplaintForm onSubmit={handleSubmit} loading={loading} />
                            </div>
                        </div>
                    </div>

                    {/* 4. SIDEBAR ANALYTICS & TIPS */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* 4a. GUIDELINES CARD */}
                        <div className="stagger-item bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/30 transition-all duration-700" />

                            <div className="relative z-10 space-y-8">
                                <div className="p-4 bg-white/10 w-fit rounded-2xl backdrop-blur-xl border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                                    <MessageSquarePlus className="text-blue-400" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight mb-2">Filing Protocol</h3>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Ensuring rapid response accuracy</p>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { id: '01', title: 'Contextual Depth', text: 'Provide exhaustive details for immediate triage.' },
                                        { id: '02', title: 'Media Evidence', text: 'Upload visual data to accelerate verification.' },
                                        { id: '03', title: 'Priority Status', text: 'Define the operational impact for urgent cases.' }
                                    ].map((tip) => (
                                        <div key={tip.id} className="flex gap-5 group/tip">
                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-600/20 flex items-center justify-center text-[11px] font-black text-blue-300 border border-blue-500/20 group-hover/tip:bg-blue-600 group-hover/tip:text-white transition-all duration-300">
                                                {tip.id}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-slate-100">{tip.title}</p>
                                                <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover/tip:text-slate-300 transition-colors">
                                                    {tip.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 4b. SLA TRACKER */}
                        <div className="stagger-item bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.3)] transition-all duration-500 group">
                            <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <Clock className="w-5 h-5 text-blue-500 group-hover:rotate-90 transition-transform duration-700" />
                                Response Matrix
                            </h4>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all duration-500">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard</p>
                                        <span className="text-sm font-black text-slate-800">Operational Tier</span>
                                    </div>
                                    <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">24h</span>
                                </div>
                                <div className="flex justify-between items-center p-6 bg-rose-50/50 rounded-[2rem] border border-rose-100 group hover:bg-white hover:shadow-lg transition-all duration-500">
                                    <div>
                                        <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Critical</p>
                                        <span className="text-sm font-black text-rose-900">Urgent Support</span>
                                    </div>
                                    <span className="text-sm font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-lg">&lt; 8h</span>
                                </div>
                            </div>
                        </div>

                        {/* 4c. HELP HUB CALLOUT */}
                        <div className="stagger-item p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 group relative overflow-hidden cursor-pointer" onClick={() => navigate('/app/student/complaints/my')}>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                                        <HelpCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Active Tickets</p>
                                        <p className="text-sm font-black">View Your Submission History</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STYLE INJECTION */}
            <style>{`
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default RaiseComplaintPage;
