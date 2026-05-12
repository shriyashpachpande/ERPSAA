import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Send, CheckCircle, ShieldAlert, FileText, FileWarning } from 'lucide-react';

const ReviewPanelPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Form States
    const [comment, setComment] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [requestedFields, setRequestedFields] = useState([]);
    
    // UI State
    const [actionMode, setActionMode] = useState('review'); // review | request_reupload | restrict

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/admissions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) setApplication(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, [id]);

    const handleAction = async (endpoint, payload = {}) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`/api/admissions/${id}/${endpoint}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                navigate('/app/staff/admissions');
            }
        } catch(err) {
            console.error('Action failed:', err);
            alert(err.response?.data?.error || 'Action failed');
        } finally {
            setActionLoading(false);
        }
    };

    const submitReview = () => handleAction('review', { status: 'under_review', comment });
    const approveApp = () => {
        if(!window.confirm('Are you absolutely sure you want to approve this admission? This action is binding.')) return;
        handleAction('approve', {});
    };
    const rejectApp = () => {
        if(!rejectionReason) return alert('Please provide a rejection reason');
        handleAction('reject', { reason: rejectionReason });
    };
    const requestReupload = () => {
        if(requestedFields.length === 0) return alert('Select at least one document to reupload');
        handleAction('request-reupload', { fields: requestedFields, comment });
    };

    const toggleField = (fieldKey) => {
        setRequestedFields(prev => prev.includes(fieldKey) ? prev.filter(f => f !== fieldKey) : [...prev, fieldKey]);
    };

    if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
    if (!application) return <div className="p-8 text-center text-red-500">Not found</div>;

    const documentOptions = [
        { key: 'tenthMarksheet', label: '10th Marksheet' },
        { key: 'twelfthMarksheet', label: '12th Marksheet' },
        { key: 'transferCertificate', label: 'Transfer Certificate' },
        { key: 'migrationCertificate', label: 'Migration Certificate' },
        { key: 'casteCertificate', label: 'Caste Certificate' },
        { key: 'incomeCertificate', label: 'Income Certificate' },
        { key: 'passportPhoto', label: 'Passport Photo' },
        { key: 'idProof', label: 'Aadhaar / ID Proof' }
    ];

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link to={`/app/staff/admissions/${id}`} className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-3">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Application
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Final Decision Panel</h1>
                    <p className="text-gray-500 font-medium tracking-tight">App: {application.applicationId}</p>
                </div>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 font-bold uppercase tracking-wider text-xs rounded-lg border border-gray-200 shadow-inner">
                    Current: {application.applicationStatus.replace('_', ' ')}
                </span>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                
                {/* Mode Selector */}
                <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 border border-gray-200">
                    <button onClick={() => setActionMode('review')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${actionMode === 'review' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Review & Comment</button>
                    <button onClick={() => setActionMode('request_reupload')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${actionMode === 'request_reupload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Request Doc Re-upload</button>
                    <button onClick={() => setActionMode('restrict')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${actionMode === 'restrict' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-red-500'}`}>Final Decisions</button>
                </div>

                {actionMode === 'review' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm font-medium flex items-start">
                           <FileText className="w-5 h-5 mr-3 shrink-0" /> Note comments below. Submitting will optionally flag the application as "Under Review".
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Staff Internal Comment</label>
                            <textarea 
                                rows="4" 
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none font-medium"
                                placeholder="E.g., Verified academic records against physical copies..."
                            />
                        </div>
                        <button onClick={submitReview} disabled={actionLoading} className="w-full flex justify-center items-center px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50">
                            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Comment & Mark Under Review'}
                        </button>
                    </div>
                )}

                {actionMode === 'request_reupload' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                         <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm font-medium flex items-start">
                           <FileWarning className="w-5 h-5 mr-3 shrink-0" /> This will shift the student's status to "Re-upload Requested" and unlock specific upload fields.
                        </div>
                         
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Select the specific documents requiring re-upload:</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {documentOptions.map(doc => (
                                    <label key={doc.key} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${requestedFields.includes(doc.key) ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-100' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded mr-3"
                                            checked={requestedFields.includes(doc.key)}
                                            onChange={() => toggleField(doc.key)}
                                        />
                                        <span className="text-sm font-semibold text-gray-800">{doc.label}</span>
                                    </label>
                                ))}
                            </div>
                         </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason / Comment for Applicant</label>
                            <textarea 
                                rows="3" 
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none font-medium"
                                placeholder="E.g., Marksheet is illegible. Please scan a colored copy."
                            />
                        </div>

                        <button onClick={requestReupload} disabled={actionLoading || requestedFields.length === 0} className="w-full flex justify-center items-center px-6 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20 disabled:opacity-50">
                            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Re-upload Request'}
                        </button>
                    </div>
                )}

                {actionMode === 'restrict' && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                        {/* Approve Box */}
                        <div className="p-8 border-2 border-green-100 bg-green-50/50 rounded-2xl text-center space-y-4">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                            <h3 className="text-xl font-bold text-green-900">Approve Admission</h3>
                            <p className="text-sm text-green-700 max-w-sm mx-auto">This will irreversibly seal the application and process the candidate as a formally approved future enrollment.</p>
                            <button onClick={approveApp} disabled={actionLoading} className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-green-600/30">
                                Verify and Approve
                            </button>
                        </div>

                        {/* Reject Box */}
                        <div className="p-8 border-2 border-red-100 bg-red-50/50 rounded-2xl text-center space-y-4">
                            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
                            <h3 className="text-xl font-bold text-red-900">Reject Application</h3>
                            <p className="text-sm text-red-700 max-w-md mx-auto">This action rejects the application entirely. You must specify a reason below.</p>
                            
                            <textarea 
                                rows="3" 
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                className="w-full max-w-lg mx-auto block p-4 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none font-medium text-left"
                                placeholder="MANDATORY: Provide clear reason for rejection."
                            />

                            <button onClick={rejectApp} disabled={actionLoading || !rejectionReason} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-600/30 disabled:opacity-50">
                                Confirmed Reject
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewPanelPage;
