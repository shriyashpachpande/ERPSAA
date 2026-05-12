import React, { useEffect, useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Package, MessageSquare, Info, User as UserIcon, BookOpen, Clock, MoreVertical, ShieldCheck, Plus } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';

const AdminBookRequestReviewPage = () => {
    const { getAllBookRequests, reviewBookRequest, loading } = useLibrary();
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [activeTab, setActiveTab] = useState('PENDING');

    const fetchRequests = async () => {
        try {
            const res = await getAllBookRequests();
            // API returns { success: true, data: [...] }
            // After useLibrary refactor, res is the response body
            setRequests(res.data || []);
        } catch (err) {
            console.error(err);
            setRequests([]);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleReview = async (status) => {
        if (!selectedRequest) return;
        try {
            await reviewBookRequest(selectedRequest._id, { status, remarks });
            setSelectedRequest(null);
            setRemarks('');
            fetchRequests();
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = requests.filter(req => activeTab === 'ALL' || req.status === activeTab);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark tracking-tight">Book Requests</h1>
                    <p className="text-gray-500 font-medium">Review and process student library suggestions</p>
                </div>
                
                <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                    {['PENDING', 'APPROVED', 'REJECTED', 'ORDERED', 'ALL'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {filtered.length > 0 ? (
                        filtered.map(req => (
                            <div 
                                key={req._id} 
                                onClick={() => req.status === 'PENDING' && setSelectedRequest(req)}
                                className={`glass-panel p-6 cursor-pointer transition-all duration-300 relative group ${
                                    selectedRequest?._id === req._id ? 'ring-2 ring-primary-500 bg-primary-50/30' : 'hover:translate-x-2'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <BookOpen className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <span className="text-[10px] font-black text-gray-400 tracking-widest">#{req.requestId}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                                req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                                                req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <h3 className="font-black text-brand-dark text-lg truncate pr-6">{req.title}</h3>
                                        <p className="text-gray-400 font-bold text-xs uppercase tracking-tight mb-4">by {req.author}</p>
                                        
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-gray-400 border-t border-gray-50 pt-4">
                                            <div className="flex items-center gap-2 text-primary-600">
                                                <UserIcon className="w-3 h-3" />
                                                <span>{req.studentId?.personalDetails?.fullName}</span>
                                            </div>
                                            <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No requests in this category</p>
                        </div>
                    )}
                </div>

                <div className="lg:sticky lg:top-8 h-fit">
                    {selectedRequest ? (
                        <div className="bg-brand-dark text-white rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <MessageSquare className="w-48 h-48" />
                            </div>
                            
                            <div className="relative z-10 space-y-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-2">Reviewing Suggestion</p>
                                    <h2 className="text-3xl font-black leading-tight mb-2 tracking-tight">{selectedRequest.title}</h2>
                                    <p className="opacity-60 font-bold flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Policy Alignment: High
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                                        <div className="flex items-center justify-between text-xs opacity-60">
                                            <span className="font-black">REASON FOR REQUEST</span>
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed italic">
                                            "{selectedRequest.reason || 'No reason provided.'}"
                                        </p>
                                    </div>

                                    <div className="space-y-2 px-2">
                                        <label className="text-[10px] font-black uppercase text-primary-400 tracking-widest pl-1">Admin Response / Remarks</label>
                                        <textarea 
                                            className="w-full p-6 bg-white/5 border border-white/10 focus:border-primary-500 rounded-3xl outline-none text-sm font-bold h-32 resize-none transition-all"
                                            placeholder="Enter approval/rejection notes..."
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => handleReview('APPROVED')}
                                        className="p-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/40"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReview('REJECTED')}
                                        className="p-5 bg-red-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/40"
                                    >
                                        Reject
                                    </button>
                                    <button 
                                        onClick={() => handleReview('ORDERED')}
                                        className="col-span-2 p-5 bg-primary-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/40 mt-2"
                                    >
                                        Mark as Ordered
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-16 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[4rem]">
                            <Plus className="w-16 h-16 text-gray-200 mx-auto mb-6 rotate-45" />
                            <h3 className="text-xl font-black text-gray-400">Select a pending request</h3>
                            <p className="text-gray-400 font-medium text-sm mt-2">Click on a request from the list to review details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookRequestReviewPage;
