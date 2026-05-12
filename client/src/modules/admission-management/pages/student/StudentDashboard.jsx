import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Loader2, CheckCircle, Clock, Search, FileX,
    ShieldAlert, FileCheck, HelpCircle, Calendar,
    MessageSquare, ArrowRight, FileText, Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');
                if (userStr) setUser(JSON.parse(userStr));

                const res = await axios.get('/api/admissions/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setApplication(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Day/Date Strip Logic
    const getDaysOfWeek = () => {
        const days = [];
        const today = new Date();
        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            days.push({
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                day: date.getDate(),
                isToday: date.toDateString() === today.toDateString()
            });
        }
        return days;
    };

    const days = getDaysOfWeek();

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            <p className="text-gray-500 font-medium animate-pulse">Syncing your application progress...</p>
        </div>
    );

    const applicationStatus = application?.applicationStatus || 'draft';
    const statusIndexMap = {
        draft: 0,
        submitted: 1,
        under_review: 2,
        pending_clarification: 2,
        reupload_requested: 2,
        approved: 3,
        rejected: 3
    };
    const currentStepIndex = statusIndexMap[applicationStatus] || 0;

    const timelineSteps = [
        { label: 'Draft', desc: 'Started' },
        { label: 'Submitted', desc: 'Waiting' },
        { label: 'Review', desc: 'Verifying' },
        { label: 'Final', desc: 'Decision' }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* 1. TOP HEADER & DAY STRIP */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
                        Welcome back, <span className="text-primary-600">{user?.fullName || 'Applicant'}</span>!
                    </h1>
                    <p className="text-gray-500 font-medium mt-1 text-lg">
                        Here’s the current progress of your admission application.
                    </p>
                </div>

                {/* Day Strip */}
                <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden pb-2 xl:pb-0 custom-scrollbar-hide">
                    {days.map((d, i) => (
                        <div
                            key={i}
                            className={`flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl border transition-all duration-300 ${d.isToday
                                    ? 'bg-primary-600 border-primary-600 text-white shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] scale-105'
                                    : 'bg-white border-gray-100 text-gray-500'
                                }`}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-widest ${d.isToday ? 'opacity-90' : 'opacity-60'}`}>
                                {d.name}
                            </span>
                            <span className="text-xl font-black mt-1">
                                {d.day}
                            </span>
                            {d.isToday && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. KPI CARDS */}
            <div ref={(el) => {
                if (el && !el.dataset.gsapDone) {
                    import('gsap').then(gsap => {
                        gsap.default.fromTo(
                            el.children,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
                        );
                        el.dataset.gsapDone = "true";
                    });
                }
            }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] transition-all group">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Application ID</p>
                    <h3 className="text-xl font-bold font-mono text-gray-900">{application?.applicationId || '---'}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] transition-all group">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        <h3 className="text-xl font-bold text-gray-900 capitalize">{applicationStatus.replace('_', ' ')}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] transition-all group">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Doc Score</p>
                    <h3 className="text-xl font-bold text-gray-900">
                        {application?.uploadedDocuments ? Object.values(application.uploadedDocuments).filter(d => d).length : 0} / 9
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] transition-all group">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">New Queries</p>
                    <h3 className="text-xl font-bold text-gray-900">{application?.requestedReuploadFields?.length || 0}</h3>
                </div>
            </div>

            {/* 3. MAIN PROGRESS & COMMENTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Progress Section */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] p-8 md:p-12 space-y-12">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Admission Journey</h2>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Tracker</span>
                    </div>

                    {/* Premium Timeline */}
                    <div className="relative flex justify-between items-start max-w-2xl mx-auto py-10">
                        <div className="absolute left-0 right-0 top-[26px] h-[5px] bg-gray-100 rounded-full" />
                        <div
                            className="absolute left-0 top-[26px] h-[5px] bg-primary-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                            style={{ width: `${(currentStepIndex / 3) * 100}%` }}
                        />

                        {timelineSteps.map((step, idx) => {
                            const isPast = idx < currentStepIndex;
                            const isCurrent = idx === currentStepIndex;
                            return (
                                <div key={idx} className="flex flex-col items-center relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white shadow-xl ${isPast ? 'bg-primary-600 text-white' :
                                            isCurrent ? 'bg-white border-primary-500 text-primary-600 scale-110' :
                                                'bg-white border-gray-100 text-gray-300'
                                        }`}>
                                        {isPast ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className={`text-sm font-black uppercase tracking-widest ${isCurrent ? 'text-primary-600' : 'text-gray-900'}`}>{step.label}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Status Alert */}
                    <div className="pt-8">
                        {applicationStatus === 'reupload_requested' ? (
                            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
                                <div className="p-3 bg-white rounded-2xl text-amber-600 shadow-sm">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-amber-900 font-black tracking-tight text-lg">Action Required!</h4>
                                    <p className="text-amber-700 font-medium mb-4">Correction requested in {application.requestedReuploadFields.length} documents.</p>
                                    <Link to="/app/student/admission/documents" className="inline-flex items-center px-5 py-2.5 bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-200">
                                        Fix Documents <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        ) : applicationStatus === 'approved' ? (
                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-start gap-4 text-center flex-col md:flex-row md:text-left">
                                <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm mx-auto md:mx-0">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-emerald-900 font-black tracking-tight text-xl">Congratulations!</h4>
                                    <p className="text-emerald-700 font-medium">Your admission application has been approved. Welcome aboard.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-primary-50 p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-primary-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-2xl text-primary-600 shadow-sm">
                                        <FileCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-primary-900 font-black tracking-tight leading-none mb-1">Check Application Status</h4>
                                        <p className="text-primary-600 font-bold uppercase tracking-widest text-[10px]">Track your real-time verification status</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Comments & Actions */}
                <div className="space-y-8">
                    {/* Recent Comments */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] p-8 max-h-[450px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                <MessageSquare className="w-5 h-5 mr-3 text-primary-500" /> Staff Feedback
                            </h3>
                            {application?.adminComments?.length > 0 && (
                                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-[10px] font-black">
                                    {application.adminComments.length}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar-hide">
                            {!application?.adminComments?.length ? (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No comments yet</p>
                                </div>
                            ) : (
                                application.adminComments.map((c, i) => (
                                    <div key={i} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl relative">
                                        <p className="text-sm font-medium text-gray-800 italic">"{c.comment}"</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Admission Cell</span>
                                            <span className="text-[9px] font-bold text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            ).reverse()}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/app/student/admission/form" className="bg-brand-dark p-6 rounded-3xl text-white group transition-all shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">
                            <FileText className="w-6 h-6 mb-3 text-white/50" />
                            <p className="font-bold tracking-tight text-sm">Resume Form</p>
                        </Link>
                        <Link to="/app/student/admission/documents" className="bg-white p-6 rounded-3xl border border-gray-100 group shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] transition-all">
                            <Upload className="w-6 h-6 mb-3 text-primary-200" />
                            <p className="font-bold tracking-tight text-sm text-gray-900">Vault Area</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
