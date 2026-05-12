import React from 'react';
import { Eye, Clock, User, Tag, Activity } from 'lucide-react';
import { COMPLAINT_STATUS_UI } from '../../../constants/complaint-management/complaintStatusUiConstants';
import { COMPLAINT_PRIORITY_UI } from '../../../constants/complaint-management/complaintPriorityUiConstants';

const ComplaintTable = ({ complaints, onView, onTrack, isLoading }) => {
    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-slate-100 rounded-xl w-full" />
                ))}
            </div>
        );
    }

    if (!complaints || complaints.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <Tag size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No complaints found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto custom-scrollbar-hide rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Complaint</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Raised On</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {complaints.map((complaint) => (
                        <tr key={complaint._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                    {complaint.complaintCode}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div>
                                    <div className="font-semibold text-slate-800 line-clamp-1">{complaint.title}</div>
                                    <div className="text-xs text-slate-500 mt-0.5 capitalize">{complaint.category}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${COMPLAINT_STATUS_UI[complaint.status]?.color || 'bg-slate-100'}`}>
                                    {COMPLAINT_STATUS_UI[complaint.status]?.label || complaint.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-xs font-medium ${COMPLAINT_PRIORITY_UI[complaint.priority]?.color}`}>
                                    {COMPLAINT_PRIORITY_UI[complaint.priority]?.label}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Clock size={12} />
                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    {onTrack && (
                                        <button
                                            onClick={() => onTrack(complaint._id)}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                            title="Track status"
                                        >
                                            <Activity size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onView(complaint._id)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        title="View details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComplaintTable;
