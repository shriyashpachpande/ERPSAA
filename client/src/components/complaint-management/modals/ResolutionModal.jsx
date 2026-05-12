import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

const ResolutionModal = ({ isOpen, onClose, onSubmit, type = 'resolve' }) => {
    const [content, setContent] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(content);
        setContent('');
    };

    const isReject = type === 'reject';
    const isEscalate = type === 'escalate';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {isReject ? <AlertTriangle size={18} className="text-red-500" /> : <CheckCircle size={18} className="text-green-500" />}
                        {isReject ? 'Reject Complaint' : isEscalate ? 'Escalate Complaint' : 'Resolve Complaint'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {isReject ? 'Reason for Rejection' : isEscalate ? 'Reason for Escalation' : 'Resolution Summary'}
                    </label>
                    <textarea
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px]"
                        placeholder={isReject ? "Briefly explain why this complaint is being rejected..." : "Provide details about the solution..."}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-slate-100 text-slate-600 font-semibold rounded-2xl hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 py-3 text-white font-semibold rounded-2xl shadow-lg transition-transform active:scale-95 ${isReject ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            Submit {isReject ? 'Rejection' : isEscalate ? 'Escalation' : 'Resolution'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResolutionModal;
