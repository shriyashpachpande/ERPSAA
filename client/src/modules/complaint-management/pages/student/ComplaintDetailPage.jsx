import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ChevronLeft, MessageSquare, Clock, Paperclip, Send, CheckCircle, RefreshCcw, Building2, FileText, AlertCircle, Shield } from 'lucide-react';
import { useComplaintDetails } from '../../../../hooks/complaint-management/useComplaintDetails';
import ComplaintTimeline from '../../../../components/complaint-management/timeline/ComplaintTimeline';
import FeedbackModal from '../../../../components/complaint-management/modals/FeedbackModal';
import complaintManagementApi from '../../../../api/complaint-management/complaintManagementApi';
import { COMPLAINT_STATUS_UI } from '../../../../constants/complaint-management/complaintStatusUiConstants';

const ComplaintDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { complaint, timeline, loading, refresh } = useComplaintDetails(id);
    const [message, setMessage] = useState('');
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            await complaintManagementApi.addMessage(id, { message });
            setMessage('');
            refresh();
            toast.success('Message sent');
        } catch (err) {
            toast.error('Failed to send message');
        }
    };

    const handleSubmitFeedback = async (feedback) => {
        try {
            await complaintManagementApi.submitFeedback(id, feedback);
            toast.success('Thank you for your feedback!');
            refresh();
        } catch (err) {
            toast.error('Failed to submit feedback');
        }
    };

    const handleReopen = async () => {
        const reason = window.prompt('Please enter a reason for reopening:');
        if (!reason) return;
        try {
            await complaintManagementApi.reopenComplaint(id, reason);
            toast.success('Complaint reopened');
            refresh();
        } catch (err) {
            toast.error('Failed to reopen');
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse text-indigo-600 font-black tracking-widest uppercase text-xs">Synchronizing Ticket Data...</div>;
    if (!complaint) return <div className="p-20 text-center text-slate-400 font-bold">Complaint session not found</div>;

    const statusInfo = COMPLAINT_STATUS_UI[complaint.status];

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-12">
            {/* Mesh Gradient Background */}
            <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-bl from-indigo-600/10 via-blue-400/5 to-transparent -z-10 blur-[120px]" />
            <div className="absolute top-[40%] left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full -z-10 blur-[100px]" />

            <div className="max-w-7xl mx-auto p-4 md:p-10 relative z-10">
                {/* Navigation & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex flex-col gap-1">
                        <button type="button"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 group w-fit"
                        >
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Registry
                        </button>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                                Ticket <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Overview</span>
                            </h1>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm mt-2 ${statusInfo?.color}`}>
                                {statusInfo?.label}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-center">
                        <div className="px-4 py-2 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm text-xs font-black text-blue-600 font-mono">
                            {complaint.complaintCode}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Complaint Brief Card */}
                        <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-white/40 overflow-hidden">
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12">
                                <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight leading-snug">
                                    {complaint.title}
                                </h3>

                                <div className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-8 rounded-[2rem] border border-slate-100/50 mb-8 relative">
                                    <div className="absolute top-4 right-4 opacity-5 text-slate-900">
                                        <FileText size={48} />
                                    </div>
                                    "{complaint.description}"
                                </div>

                                {complaint.evidenceImages?.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                            <Paperclip size={14} /> Supporting Documents
                                        </h4>
                                        <div className="flex flex-wrap gap-4">
                                            {complaint.evidenceImages.map((img, i) => (
                                                <a href={img.fileUrl} target="_blank" rel="noreferrer" key={i}
                                                    className="block group h-32 w-32 rounded-3xl overflow-hidden border-2 border-slate-100 hover:border-indigo-400 p-1 bg-white transition-all hover:scale-105 shadow-sm active:scale-95">
                                                    <img src={img.fileUrl} alt="Evidence" className="h-full w-full object-cover rounded-[1.25rem]" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interactive Timeline */}
                        <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-10 border border-white/60 shadow-inner">
                            <h2 className="text-2xl font-black text-slate-900 mb-12 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <Clock className="text-indigo-600" size={24} />
                                </div>
                                Resolution Pulse
                            </h2>
                            <div className="px-4 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar scroll-smooth">
                                <ComplaintTimeline timeline={timeline} />
                            </div>
                        </div>

                        {/* Communication Dock */}
                        {['closed', 'rejected', 'resolved'].indexOf(complaint.status) === -1 && (
                            <div className="sticky bottom-8 bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] p-4 shadow-2xl border border-white/10 flex items-center gap-4 group hover:bg-slate-900 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="h-12 w-12 bg-white/10 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
                                    <MessageSquare size={22} />
                                </div>
                                <form onSubmit={handleSendMessage} className="flex-1 flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Add to the conversation..."
                                        className="flex-1 px-6 py-3 bg-white/5 rounded-2xl outline-none focus:bg-white/10 transition-all font-semibold text-white placeholder:text-slate-500"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <button type="submit" className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-90 transform group-hover:scale-110">
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Meta Sidebar */}
                    <div className="lg:col-span-4 space-y-8 sticky top-10">
                        {/* Meta Info Card */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)]">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Metadata Explorer</h4>
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-black uppercase mb-0.5">Category</div>
                                        <div className="text-base font-black text-slate-800 capitalize leading-none">{complaint.category}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-black uppercase mb-0.5">Priority</div>
                                        <div className="text-base font-black text-slate-800 capitalize leading-none">{complaint.priority}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-black uppercase mb-0.5">Handler</div>
                                        <div className="text-base font-black text-slate-800 leading-none">
                                            {complaint.assignedTo?.fullName || complaint.assignedRole || 'System Pool'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Control Hub */}
                        <div className="space-y-4">
                            {complaint.status === 'resolved' && (
                                <>
                                    <button type="button"
                                        onClick={() => setIsFeedbackOpen(true)}
                                        className="w-full py-6 animate-hue-smooth text-white font-black rounded-[2rem] hover:shadow-indigo-300 shadow-2xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 group overflow-hidden relative"
                                        style={{ background: 'linear-gradient(135deg, rgb(16, 185, 129), rgb(6, 182, 212), rgb(59, 130, 246), rgb(99, 102, 241), rgb(139, 92, 246), rgb(236, 72, 153), rgb(244, 63, 94))', backgroundSize: '200% 200%' }}
                                    >
                                        <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                                            <CheckCircle size={20} />
                                        </div>
                                        Finalize & Close
                                    </button>
                                    <button type="button"
                                        onClick={handleReopen}
                                        className="w-full py-6 bg-white text-slate-700 border border-slate-200 font-black rounded-[2rem] hover:bg-slate-50 hover:border-orange-200 hover:text-orange-600 shadow-sm transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 group"
                                    >
                                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-orange-50 transition-colors">
                                            <RefreshCcw size={20} />
                                        </div>
                                        Reopen Ticket
                                    </button>
                                </>
                            )}

                            {complaint.status === 'closed' && (
                                <div className="p-10 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-[3rem] text-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                    <div className="p-5 bg-white rounded-3xl w-fit mx-auto mb-6 shadow-xl shadow-indigo-100/50 transform group-hover:rotate-12 transition-transform">
                                        <CheckCircle size={32} className="text-emerald-500" />
                                    </div>
                                    <p className="text-lg font-black text-indigo-900 leading-tight">Ticket Archived</p>
                                    <p className="text-[10px] text-indigo-400 mt-2 font-black uppercase tracking-widest">Feedback Lifecycle Complete</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                onSubmit={handleSubmitFeedback}
            />
        </div>
    );
};

export default ComplaintDetailPage;
