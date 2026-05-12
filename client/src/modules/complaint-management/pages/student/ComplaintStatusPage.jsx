import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useStudentComplaintStatusList } from '../../../../hooks/complaint-management/useStudentComplaintStatusList';
import { COMPLAINT_STATUS_UI } from '../../../../constants/complaint-management/complaintStatusUiConstants';

const ComplaintStatusPage = () => {
    const navigate = useNavigate();
    const { statusList, loading, error } = useStudentComplaintStatusList();

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <Activity size={28} />
                    </div>
                    Complaint Status Tracking
                </h1>
                <p className="text-slate-500 font-medium mt-1">Real-time status of your active tickets</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-100 rounded-[2rem] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statusList.map((ticket) => (
                        <div 
                            key={ticket._id}
                            onClick={() => navigate(`/app/student/complaints/status/${ticket._id}`)}
                            className="group bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-blue-300 hover:shadow-blue-200/20 transition-all cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                    {ticket.complaintCode}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${COMPLAINT_STATUS_UI[ticket.status]?.color}`}>
                                    {COMPLAINT_STATUS_UI[ticket.status]?.label}
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {ticket.title}
                            </h3>
                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="text-[10px] text-slate-400 font-medium">
                                    Last Update: {new Date(ticket.updatedAt).toLocaleDateString()}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 transition-colors uppercase italic">
                                    View Details →
                                </div>
                            </div>
                        </div>
                    ))}

                    {statusList.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium">No complaints found to track</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComplaintStatusPage;
