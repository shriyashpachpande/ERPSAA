import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import {
    Plus, Search, BookOpen, Clock, CheckCircle, XCircle, Send, Info, Tag,
    User as UserIcon, ArrowLeft, Loader2, Sparkles, MessageSquare, BookText,
    ChevronRight, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLibrary from '../hooks/useLibrary';
import { getMyMasterProfile } from '../../student-master/services/studentMasterService';
import gsap from 'gsap';

const StudentBookRequestPage = () => {
    const navigate = useNavigate();
    const { getStudentBookRequests, createBookRequest, loading: apiLoading } = useLibrary();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', author: '', publisher: '', category: '', reason: ''
    });
    const containerRef = useRef(null);

    const fetchRequests = async () => {
        try {
            const student = await getMyMasterProfile();
            const res = await getStudentBookRequests(student.data._id);
            if (res.success) {
                setRequests(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
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
    }, [loading, requests, showForm]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createBookRequest(formData);
            if (res.success) {
                setShowForm(false);
                setFormData({ title: '', author: '', publisher: '', category: '', reason: '' });
                fetchRequests();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case 'APPROVED': return { color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Approved' };
            case 'REJECTED': return { color: '#EF4444', bg: 'bg-rose-50', border: 'border-rose-200', label: 'Declined' };
            case 'ORDERED': return { color: '#6366F1', bg: 'bg-indigo-50', border: 'border-indigo-200', label: 'Ordered' };
            default: return { color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Pending' };
        }
    };

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-50 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Processing Requests</p>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FDFDFF] pb-32 p-4 md:p-10">
            {/* Elite Header */}
            <div className="max-w-6xl mx-auto mb-16 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 stagger-item">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="group p-4 bg-white rounded-3xl shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all duration-500"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Curate Collection</h1>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 flex items-center gap-3">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                Suggest New Academic Resources
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`px-10 py-5 ${showForm ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-900 hover:bg-blue-600'} text-white rounded-3xl font-black flex items-center gap-4 transition-all duration-500 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] active:scale-95`}
                    >
                        {showForm ? <XCircle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        <span className="text-xs uppercase tracking-widest">{showForm ? 'Cancel Request' : 'New Suggestion'}</span>
                    </button>
                </div>
            </div>

            <main className="max-w-6xl mx-auto space-y-12">
                {/* Modern Form */}
                {showForm && (
                    <div className="stagger-item bg-white rounded-[4rem] p-10 border border-slate-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

                        <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Publication Title *</label>
                                    <input name="title" required className="suggestion-input" placeholder="e.g. The Pragmatic Programmer" value={formData.title} onChange={handleChange} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Author Authority *</label>
                                    <input name="author" required className="suggestion-input" placeholder="e.g. Andrew Hunt" value={formData.author} onChange={handleChange} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Publisher Entity</label>
                                    <input name="publisher" className="suggestion-input" placeholder="e.g. Addison-Wesley" value={formData.publisher} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-8 flex flex-col">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Resource Category</label>
                                    <input name="category" className="suggestion-input" placeholder="e.g. Computing / Software" value={formData.category} onChange={handleChange} />
                                </div>
                                <div className="space-y-3 flex-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Academic Rationale</label>
                                    <textarea name="reason" className="suggestion-input h-32 md:h-full resize-none" placeholder="Describe the educational impact..." value={formData.reason} onChange={handleChange} />
                                </div>
                                <button
                                    type="submit"
                                    disabled={apiLoading}
                                    className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-slate-900 transition-all duration-500 shadow-xl shadow-blue-500/20 active:scale-95 disabled:grayscale"
                                >
                                    <Send className="w-5 h-5" />
                                    <span className="text-xs uppercase tracking-widest">Transmit Suggestion</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {requests.length > 0 ? (
                        requests.map(req => {
                            const theme = getStatusTheme(req.status);
                            return (
                                <div key={req._id} className="stagger-item group relative bg-white rounded-[3rem] border border-slate-100 p-8 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all duration-500 overflow-hidden flex flex-col h-full">
                                    {/* Glass Accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>

                                    <div className="flex items-start justify-between mb-8">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-all duration-500">
                                            <BookText className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-xl border-2 ${theme.bg} ${theme.border} flex items-center gap-2`}>
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.color }}></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.color }}>{theme.label}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-500">
                                                {req.title}
                                            </h3>
                                            <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2">
                                                <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                                                {req.author}
                                            </p>
                                        </div>

                                        <div className="h-px bg-slate-50 w-full"></div>

                                        {req.reason && (
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3 group-hover:bg-white transition-colors duration-500">
                                                <MessageSquare className="w-4 h-4 text-slate-300 mt-0.5" />
                                                <p className="text-xs font-bold text-slate-500 italic leading-relaxed line-clamp-3">"{req.reason}"</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Requested On</span>
                                            <span className="text-[10px] font-black text-slate-600">{new Date(req.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Token ID</span>
                                            <p className="text-[10px] font-black text-slate-900 tracking-tighter">#{req.requestId}</p>
                                        </div>
                                    </div>

                                    {req.adminRemarks && (
                                        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                                            <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest mb-1">Review Response</p>
                                                <p className="text-xs font-bold text-blue-700 leading-relaxed">{req.adminRemarks}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <div className="stagger-item col-span-full py-40 text-center bg-white rounded-[5rem] border border-slate-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] flex flex-col items-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-10 border border-slate-100 shadow-xl group-hover:scale-110 transition-transform duration-700">
                                    <BookOpen className="w-14 h-14 text-slate-200" />
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Suggest a Legacy</h3>
                                <p className="text-slate-400 font-bold max-w-sm mx-auto uppercase tracking-[0.25em] text-[10px] leading-[2.5]">
                                    Is there a book missing from our repository? Share your suggestion and help us grow our knowledge base.
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="mt-12 px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 transition-all duration-500 active:scale-95 flex items-center gap-6 shadow-2xl shadow-brand-dark/20 hover:shadow-blue-500/40"
                                >
                                    Submit First Suggestion
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                .suggestion-input {
                    width: 100%;
                    padding: 1.25rem 1.75rem;
                    background: #f8fafc;
                    border: 2px solid transparent;
                    border-radius: 1.5rem;
                    outline: none;
                    font-weight: 800;
                    color: #1e293b;
                    font-size: 0.875rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .suggestion-input:focus {
                    background: white;
                    border-color: #3b82f6;
                    box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.1);
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default StudentBookRequestPage;
