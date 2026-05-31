import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, Clock, Search, FileX, ShieldAlert, FileCheck, HelpCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdmissionStatusTrackerPage = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/admissions/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success && res.data.data) {
                    setApplication(res.data.data);
                }
            } catch (err) {
                if (err.response?.status !== 404) {
                    setError('Failed to fetch status');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, []);

    if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

    if (!application) {
        return (
            <div className="p-6 md:p-10 max-w-4xl mx-auto text-center space-y-6">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <FileX className="w-16 h-16 text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Application Found</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">You haven't started an admission application yet. Start filling out the form to secure your seat.</p>
                    <Link to="/app/student/admission/form" className="px-6 py-3 bg-brand-dark text-white rounded-xl font-semibold hover:bg-black transition-colors shadow-lg">Start Application</Link>
                </div>
            </div>
        );
    }

    const { applicationStatus, adminComments, requestedReuploadFields, rejectionReason } = application;

    const timelineSteps = [
        { id: 'draft', label: 'Application Started', icon: FileCheck },
        { id: 'submitted', label: 'Application Submitted', icon: CheckCircle },
        { id: 'under_review', label: 'Under Verification', icon: Search },
        { id: 'decision', label: 'Final Decision', icon: ShieldAlert } 
    ];

    const getStatusIndex = () => {
        if (['draft'].includes(applicationStatus)) return 0;
        if (['submitted'].includes(applicationStatus)) return 1;
        if (['under_review', 'pending_clarification', 'reupload_requested'].includes(applicationStatus)) return 2;
        if (['approved', 'rejected'].includes(applicationStatus)) return 3;
        return 0;
    };

    const currentStepIndex = getStatusIndex();

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Application Tracker</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                    Real-time Admission Verification Pipeline
                </p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-gray-100 transition-all group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-gray-100">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Application ID</p>
                        <p className="text-2xl font-bold font-mono text-gray-900">{application.applicationId}</p>
                    </div>
                    <div className="mt-6 md:mt-0 text-left md:text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                        <span className="inline-block px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest bg-primary-50 text-primary-600 border border-primary-100 shadow-sm">
                            {applicationStatus.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>

                {/* Professional Timeline */}
                <div className="relative flex justify-between items-center mb-20 max-w-3xl mx-auto py-10">
                    <div className="absolute left-0 right-0 top-1/2 h-1.5 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
                    <div 
                        className="absolute left-0 top-1/2 h-1.5 bg-primary-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                        style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
                    ></div>

                    {timelineSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isActive = index === currentStepIndex;
                        const Icon = step.icon;
                        
                        return (
                            <div key={step.id} className="flex flex-col items-center relative z-10">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-white transition-all duration-700 shadow-xl ${isCompleted ? 'bg-primary-600 text-white' : 'bg-white text-gray-300 border-gray-50'}`}>
                                    <Icon className={`w-7 h-7 ${isActive ? 'animate-pulse' : ''}`} />
                                </div>
                                <div className="absolute -bottom-12 w-40 text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {step.label}
                                    </p>
                                </div>
                                {isCompleted && !isActive && index < currentStepIndex && (
                                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        <CheckCircle className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Status Specific Alerts */}
                <div className="mt-16 space-y-6">
                    {applicationStatus === 'rejected' && (
                        <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2rem] flex items-start gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                                <ShieldAlert className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-rose-900 font-black text-xl tracking-tight mb-2">Application Decision</h3>
                                <p className="text-rose-700 font-medium leading-relaxed">{rejectionReason}</p>
                            </div>
                        </div>
                    )}
                    
                    {applicationStatus === 'approved' && (
                        <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[3rem] text-center">
                            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-200/50 mx-auto mb-6">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h3 className="text-emerald-900 font-black text-3xl tracking-tight mb-3">Welcome Aboard!</h3>
                            <p className="text-emerald-700 font-medium max-w-md mx-auto text-lg leading-relaxed">Your admission has been officially approved. We are excited to have you as part of our academic community.</p>
                            <div className="mt-8 flex justify-center gap-4">
                                <button type="button" className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-200">Download Letter</button>
                                <Link to="/app/student/fees" className="px-8 py-3 bg-white text-emerald-600 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Pay Fees</Link>
                            </div>
                        </div>
                    )}

                    {applicationStatus === 'reupload_requested' && (
                        <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-start gap-8">
                            <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                                <HelpCircle className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-amber-900 font-black text-xl tracking-tight mb-3">Action Required: Document Resubmission</h3>
                                <p className="text-amber-700 font-medium mb-6 leading-relaxed">The verification cell found issues with certain files. Please re-upload high-quality scans of the following:</p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {requestedReuploadFields.map(field => (
                                        <span key={field} className="px-4 py-2 bg-white border border-amber-200 text-amber-800 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            {field.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    ))}
                                </div>
                                <Link to="/app/student/admission/documents" className="inline-flex items-center px-8 py-3 bg-amber-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-amber-200">
                                    Fix Now <ChevronRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {adminComments.length > 0 && (
                        <div className="mt-12 pt-12 border-t border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Verification History</h3>
                            <div className="space-y-6">
                                {adminComments.map((comment, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                            <FileCheck className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 pb-6 border-b border-gray-50 last:border-0">
                                            <p className="text-gray-800 font-bold leading-relaxed">"{comment.comment}"</p>
                                            <div className="mt-2 flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase text-gray-400">Admission Cell</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                <span className="text-[10px] font-bold text-gray-400">{new Date(comment.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                )).reverse()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdmissionStatusTrackerPage;
