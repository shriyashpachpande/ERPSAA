import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ChevronLeft, MessageSquare, Clock, CheckCircle, XCircle, AlertTriangle, Send } from 'lucide-react';
import { useComplaintDetails } from '../../../../hooks/complaint-management/useComplaintDetails';
import ComplaintTimeline from '../../../../components/complaint-management/timeline/ComplaintTimeline';
import ResolutionModal from '../../../../components/complaint-management/modals/ResolutionModal';
import complaintManagementApi from '../../../../api/complaint-management/complaintManagementApi';
import { COMPLAINT_STATUS_UI } from '../../../../constants/complaint-management/complaintStatusUiConstants';

const StaffComplaintDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { complaint, timeline, loading, refresh } = useComplaintDetails(id);
    const [message, setMessage] = useState('');
    const [actionModal, setActionModal] = useState({ isOpen: false, type: 'resolve' });

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

    const handleActionSubmit = async (content) => {
        try {
            if (actionModal.type === 'resolve') {
                await complaintManagementApi.resolveComplaint(id, content);
                toast.success('Complaint marked as resolved');
            } else if (actionModal.type === 'reject') {
                await complaintManagementApi.rejectComplaint(id, content);
                toast.success('Complaint rejected');
            } else if (actionModal.type === 'escalate') {
                await complaintManagementApi.escalateComplaint(id, content);
                toast.success('Complaint escalated to HOD/Admin');
            }
            setActionModal({ isOpen: false, type: 'resolve' });
            refresh();
        } catch (err) {
            toast.error(`Operation failed: ${err.response?.data?.error || 'Server error'}`);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading complaint...</div>;
    if (!complaint) return <div className="p-8 text-center">Complaint not found</div>;

    const statusInfo = COMPLAINT_STATUS_UI[complaint.status];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 group transition-colors"
            >
                <ChevronLeft size={20} />
                <span className="font-medium">Back to Queue</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Information Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl font-black border border-blue-100 italic shadow-inner">
                                {complaint.studentSnapshot?.fullName?.[0] || '?'}
                            </div>
                            <h2 className="text-xl font-black text-slate-900 leading-tight">
                                {complaint.studentSnapshot?.fullName || 'Student Name'}
                            </h2>
                            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-tighter">
                                {complaint.isAnonymous ? 'Requested Anonymity' : 'Identity Shared'}
                            </p>
                        </div>
                        
                        <div className="space-y-4 pt-6 border-t border-slate-50">
                            <div>
                                <div className="text-[10px] text-slate-400 font-black uppercase mb-1">Email / ID</div>
                                <div className="text-sm font-bold text-slate-800 truncate">{complaint.studentSnapshot?.email || 'N/A'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-black uppercase mb-1">Department</div>
                                <div className="text-sm font-bold text-slate-800">{complaint.studentSnapshot?.department || 'N/A'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-black uppercase mb-1">Section / Roll</div>
                                <div className="text-sm font-bold text-slate-800">
                                    {complaint.studentSnapshot?.section || 'N/A'} - {complaint.studentSnapshot?.rollNumber || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 rounded-[2rem] p-6 shadow-2xl text-white">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Admin Controls</h4>
                        <div className="space-y-3">
                            {['resolved', 'closed', 'rejected'].indexOf(complaint.status) === -1 && (
                                <>
                                    <button 
                                        onClick={() => setActionModal({ isOpen: true, type: 'resolve' })}
                                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={16} /> Resolve
                                    </button>
                                    <button 
                                        onClick={() => setActionModal({ isOpen: true, type: 'reject' })}
                                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                    <button 
                                        onClick={() => setActionModal({ isOpen: true, type: 'escalate' })}
                                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <AlertTriangle size={16} /> Escalate
                                    </button>
                                </>
                            )}
                            <div className="pt-4 border-t border-white/10 mt-4">
                                <p className="text-[10px] text-slate-500 font-medium">Currently Status:</p>
                                <p className="text-sm font-black text-blue-400 uppercase tracking-wider mt-1">{complaint.status}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Processing Area */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-mono text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                {complaint.complaintCode}
                            </span>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusInfo?.color}`}>
                                {statusInfo?.label}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{complaint.title}</h1>
                        <div className="text-lg text-slate-600 leading-relaxed mb-6 font-medium border-l-4 border-blue-500 pl-6 py-2">
                            {complaint.description}
                        </div>

                        {complaint.evidenceImages?.length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-8">
                                {complaint.evidenceImages.map((img, i) => (
                                    <a href={img.fileUrl} target="_blank" rel="noreferrer" key={i} className="block relative group">
                                        <div className="h-32 w-48 rounded-[1.5rem] overflow-hidden border-2 border-slate-100 group-hover:border-blue-500 transition-all">
                                            <img src={img.fileUrl} alt="Evidence" className="h-full w-full object-cover" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Interaction */}
                    <div className="bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100">
                        <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3">
                            <Clock className="text-slate-400" />
                            Incident Lifecycle
                        </h3>
                        <ComplaintTimeline timeline={timeline} />
                        
                        {['closed', 'rejected'].indexOf(complaint.status) === -1 && (
                            <div className="mt-12 bg-white rounded-[2rem] p-2 shadow-xl border border-slate-100 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Reply to student or add note..."
                                    className="flex-1 px-6 py-3 bg-transparent outline-none font-bold text-slate-700"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ResolutionModal 
                isOpen={actionModal.isOpen}
                type={actionModal.type}
                onClose={() => setActionModal({ ...actionModal, isOpen: false })}
                onSubmit={handleActionSubmit}
            />
        </div>
    );
};

export default StaffComplaintDetailPage;
