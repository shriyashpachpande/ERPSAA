import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    User, 
    Book as BookIcon, 
    AlertCircle,
    Search,
    Loader2,
    Calendar,
    ArrowRight
} from 'lucide-react';
import useLibrary from '../hooks/useLibrary';
import gsap from 'gsap';

const IssueRequestsReviewPage = () => {
    const navigate = useNavigate();
    const { getAllIssueRequests, reviewIssueRequest, issueBook, loading: apiLoading } = useLibrary();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionStatus, setActionStatus] = useState({ id: null, loading: false, message: '', type: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await getAllIssueRequests();
            setRequests(res.data);
        } catch (err) {
            setError('Failed to fetch issue requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleReview = async (id, status, remarks = '') => {
        try {
            setActionStatus({ id, loading: true, message: `Processing ${status.toLowerCase()}...`, type: 'info' });
            
            // 1. Update Request Status
            const res = await reviewIssueRequest(id, { status, remarks });
            
            if (res.success && status === 'APPROVED') {
                // 2. If approved, perform the actual ISSUE transaction
                const request = requests.find(r => r._id === id);
                if (request && request.bookId && request.studentId) {
                    // Logic: Librarian picks a copy or uses the suggested one
                    // For now, we'll try to use the suggested copy if available, or librarian must pick one manually in a real flow.
                    // Here we'll automate the issue for simplicity if a copy was suggested.
                    if (request.copyId) {
                        try {
                            await issueBook({
                                studentId: request.studentId._id,
                                bookId: request.bookId._id,
                                copyId: request.copyId
                            });
                             setActionStatus({ id, loading: false, message: 'Request approved and book issued!', type: 'success' });
                        } catch (issueErr) {
                            console.error("Issue failed after approval:", issueErr);
                            setActionStatus({ id, loading: false, message: 'Request approved but auto-issue failed. Please issue manually.', type: 'warning' });
                        }
                    } else {
                        setActionStatus({ id, loading: false, message: 'Request approved! Please perform manual issue for this student.', type: 'success' });
                    }
                }
            } else if (res.success) {
                setActionStatus({ id, loading: false, message: `Request ${status.toLowerCase()} successfully.`, type: 'success' });
            }

            fetchRequests();
        } catch (err) {
            setActionStatus({ id, loading: false, message: err.response?.data?.error || 'Action failed', type: 'error' });
        }
    };

    const filteredRequests = requests.filter(req => 
        (req.studentId?.personalDetails?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.bookId?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.requestId || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'CANCELLED': return 'bg-gray-50 text-gray-400 border-gray-100';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-brand-dark tracking-tight">Issue Requests</h1>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em]">Student Borrow Petitions</p>
                </div>
                
                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by student, book, or request ID..." 
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-primary-500/20 font-bold transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading requests...</p>
                </div>
            ) : filteredRequests.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {filteredRequests.map((req) => (
                        <div key={req._id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden relative">
                            {/* Status Ribbon */}
                            <div className={`absolute top-0 right-0 px-8 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-[0.15em] border-l border-b ${getStatusColor(req.status)}`}>
                                {req.status}
                            </div>

                            <div className="flex flex-col xl:flex-row gap-10">
                                {/* Student Info */}
                                <div className="flex items-start gap-6 xl:w-1/3">
                                    <div className="w-16 h-16 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-600 font-black text-2xl border border-primary-100 uppercase overflow-hidden">
                                        {req.studentId?.personalDetails?.fullName?.substring(0, 2) || '??'}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <User className="w-3 h-3 text-primary-400" /> Requester
                                        </div>
                                        <h3 className="text-xl font-black text-brand-dark tracking-tight">
                                            {req.studentId?.personalDetails?.fullName || 'Unknown Student'}
                                        </h3>
                                        <p className="text-xs text-primary-600 font-black tracking-tighter uppercase whitespace-nowrap">
                                            ID: {req.studentId?.studentId || 'N/A'} • {req.requestId}
                                        </p>
                                    </div>
                                </div>

                                {/* Book Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <BookIcon className="w-3 h-3 text-indigo-400" /> Book Requested
                                        </div>
                                        <h4 className="text-lg font-black text-brand-dark line-clamp-1 group-hover:text-primary-600 transition-colors">
                                            {req.bookId?.title || 'Unknown Book'}
                                        </h4>
                                        <p className="text-xs font-bold text-gray-400 italic">by {req.bookId?.author || 'Unknown Author'}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-wide">
                                                Requested: {new Date(req.requestDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {req.copyId && (
                                            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                                                <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wide">
                                                    Reserved Copy Available
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="xl:w-1/4 flex flex-col md:flex-row xl:flex-col justify-center gap-3">
                                    {req.status === 'PENDING' ? (
                                        <>
                                            <button 
                                                onClick={() => handleReview(req._id, 'APPROVED')}
                                                disabled={actionStatus.loading && actionStatus.id === req._id}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.1em] py-3 rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-[10px] flex items-center justify-center gap-2"
                                            >
                                                {actionStatus.loading && actionStatus.id === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                Just Approve
                                            </button>
                                            <button 
                                                onClick={async () => {
                                                    await handleReview(req._id, 'APPROVED');
                                                    // After approval, navigate to Issue page with prefilled data
                                                    navigate('/app/library/issue', { 
                                                        state: { 
                                                            prefilledStudent: req.studentId, 
                                                            prefilledBook: req.bookId,
                                                            prefilledRequestId: req._id
                                                        } 
                                                    });
                                                }}
                                                disabled={actionStatus.loading && actionStatus.id === req._id}
                                                className="flex-1 bg-brand-dark hover:bg-black text-white font-black uppercase tracking-[0.1em] py-3 rounded-2xl shadow-lg active:scale-95 transition-all text-[10px] flex items-center justify-center gap-2"
                                            >
                                                Approve & Issue
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleReview(req._id, 'REJECTED')}
                                                disabled={actionStatus.loading && actionStatus.id === req._id}
                                                className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black uppercase tracking-[0.1em] py-3 rounded-2xl border-2 border-rose-100 active:scale-95 transition-all text-[10px] flex items-center justify-center gap-2"
                                            >
                                                {actionStatus.loading && actionStatus.id === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                Reject Request
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center py-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Processed on {new Date(req.reviewedAt || req.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Feedback Overlay for this item */}
                            {actionStatus.id === req._id && actionStatus.message && (
                                <div className={`absolute inset-0 z-20 backdrop-blur-[2px] flex items-center justify-center p-6 animate-in fade-in duration-300 ${
                                    actionStatus.type === 'success' ? 'bg-emerald-600/90 text-white' : 
                                    actionStatus.type === 'error' ? 'bg-rose-600/90 text-white' : 
                                    'bg-primary-600/90 text-white'
                                }`}>
                                   <div className="text-center space-y-4">
                                        {actionStatus.type === 'success' ? <CheckCircle className="w-12 h-12 mx-auto" /> : 
                                         actionStatus.type === 'error' ? <AlertCircle className="w-12 h-12 mx-auto" /> : 
                                         <Loader2 className="w-12 h-12 mx-auto animate-spin" />}
                                        <p className="text-lg font-black tracking-tight">{actionStatus.message}</p>
                                        {!actionStatus.loading && (
                                            <button 
                                                onClick={() => setActionStatus({ id: null, loading: false, message: '', type: '' })}
                                                className="bg-white text-brand-dark px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest"
                                            >
                                                Dismiss
                                            </button>
                                        )}
                                   </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
                    <div className="p-8 bg-white rounded-full w-fit mx-auto mb-8 shadow-xl border border-gray-100">
                        <Clock className="w-12 h-12 text-gray-200" />
                    </div>
                    <h3 className="text-3xl font-black text-brand-dark mb-3 tracking-tight">Zero Pending Requests</h3>
                    <p className="text-gray-400 font-bold max-w-sm mx-auto uppercase tracking-widest text-xs">Everything is up to date. Excellent work!</p>
                </div>
            )}
        </div>
    );
};

export default IssueRequestsReviewPage;
