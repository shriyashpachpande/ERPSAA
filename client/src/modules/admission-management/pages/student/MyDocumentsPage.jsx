import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Loader2, UploadCloud, File, AlertCircle, CheckCircle, ExternalLink, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFileUrl } from '../../../../utils/fileUrlResolver';

// resolveUrl is now handled by the centralized getFileUrl
const resolveUrl = (urlOrPath) => getFileUrl(urlOrPath);


const DOC_LIST = [
    { key: 'tenthMarksheet', label: '10th Marksheet' },
    { key: 'twelfthMarksheet', label: '12th Marksheet' },
    { key: 'transferCertificate', label: 'Transfer Certificate' },
    { key: 'migrationCertificate', label: 'Migration Certificate' },
    { key: 'casteCertificate', label: 'Caste Certificate' },
    { key: 'incomeCertificate', label: 'Income Certificate' },
    { key: 'passportPhoto', label: 'Passport Size Photo' },
    { key: 'idProof', label: 'Aadhaar / ID Proof' },
    { key: 'domicileCertificate', label: 'Domicile Certificate' },
    { key: 'entranceScorecard', label: 'Entrance Scorecard' },
    { key: 'disabilityCertificate', label: 'Disability Certificate' },
];

const MyDocumentsPage = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    // For re-upload: track File objects per field
    const [reuploadFiles, setReuploadFiles] = useState({});

    const token = localStorage.getItem('token');

    const fetchApplication = async () => {
        try {
            const res = await axios.get('/api/admissions/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.data) {
                setApplication(res.data.data);
            }
        } catch (err) {
            console.log('No application found.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplication(); }, []);

    const handleReuploadFileChange = (key, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setReuploadFiles(prev => ({ ...prev, [key]: file }));
    };

    const handleSubmitReupload = async () => {
        if (Object.keys(reuploadFiles).length === 0) {
            setErrorMsg('Please select at least one file to re-upload.');
            return;
        }
        setActionLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const fd = new FormData();
            Object.entries(reuploadFiles).forEach(([fieldName, file]) => {
                fd.append(fieldName, file);
            });

            const res = await axios.put('/api/admissions/reupload', fd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMsg('Documents re-uploaded successfully! The staff will review them shortly.');
            setApplication(res.data.data);
            setReuploadFiles({});
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Failed to re-upload documents');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

    if (!application) {
        return (
            <div className="p-8 text-center max-w-xl mx-auto mt-10">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">No active application</h2>
                <p className="text-gray-500 mb-6">You must start an admission application before uploading specific documents.</p>
                <Link to="/app/student/admission/form" className="text-primary-600 font-semibold hover:underline">Go to Admission Form</Link>
            </div>
        );
    }

    const { applicationStatus, requestedReuploadFields = [], uploadedDocuments = {}, personalDetails } = application;
    const isReuploadMode = applicationStatus === 'reupload_requested';
    const profilePhotoUrl = personalDetails?.profilePhotoUrl;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Document Vault</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        Secure Digital Document Storage
                    </p>
                </div>
                {profilePhotoUrl && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-4 bg-white border border-gray-100 rounded-[2rem] px-6 py-4 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] transition-all group"
                    >
                        <div className="relative">
                            <img 
                                src={resolveUrl(profilePhotoUrl)} 
                                alt="Profile" 
                                className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-100 transition-transform" 
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Student Profile</p>
                            <p className="text-sm font-black text-gray-900">{personalDetails?.fullName || 'Academic User'}</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {errorMsg && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center shadow-sm">
                    <AlertCircle className="w-5 h-5 mr-2" />{errorMsg}
                </motion.div>
            )}
            {successMsg && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold flex items-center shadow-sm">
                    <CheckCircle className="w-5 h-5 mr-2" />{successMsg}
                </motion.div>
            )}

            {/* Re-upload Panel */}
            {isReuploadMode && (
                <div className="bg-white border border-amber-200 rounded-[2.5rem] p-8 md:p-12 shadow-[0px_0px_10px_2px_rgba(245,158,11,0.2),0px_0px_20px_8px_rgba(245,158,11,0.1)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-500 mb-4 shadow-sm">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Resubmission Required</h3>
                        <p className="text-gray-500 font-medium max-w-lg">
                            The verification cell has flagged certain documents. Please provide clear, updated scans of the items highlighted below.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requestedReuploadFields.map(fieldKey => {
                            const label = DOC_LIST.find(d => d.key === fieldKey)?.label || fieldKey;
                            const selectedFile = reuploadFiles[fieldKey];
                            return (
                                <div key={fieldKey} className="bg-gray-50/50 border border-amber-100 rounded-[2rem] p-6 transition-all">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{label}</p>
                                    <label className="flex flex-col items-center justify-center px-4 py-8 rounded-2xl bg-white border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 cursor-pointer transition-all group/upload">
                                        <UploadCloud className="w-8 h-8 mb-2 group-hover/upload:-translate-y-1 transition-transform" />
                                        <span className="text-xs font-black uppercase tracking-wider">{selectedFile ? 'Change Selection' : 'Select Update'}</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" className="hidden" onChange={(e) => handleReuploadFileChange(fieldKey, e)} />
                                    </label>
                                    {selectedFile && (
                                        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                                            <CheckCircle className="w-3 h-3 shrink-0" />
                                            <p className="text-[10px] font-black uppercase tracking-tight truncate">{selectedFile.name}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center mt-12">
                        <button type="button"
                            onClick={handleSubmitReupload}
                            disabled={actionLoading || Object.keys(reuploadFiles).length === 0}
                            className="px-10 py-4 bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-600/30 hover:bg-amber-700 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
                        >
                            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                            Commit Updates
                        </button>
                    </div>
                </div>
            )}

            {/* Document Main Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {DOC_LIST.map((doc, idx) => {
                    const meta = uploadedDocuments?.[doc.key];
                    const isUploaded = !!meta?.filePath;
                    const isRequested = requestedReuploadFields?.includes(doc.key);
                    const isImage = meta?.mimeType?.startsWith('image/');
                    const fileUrl = isUploaded ? resolveUrl(meta.filePath) : null;

                    return (
                        <motion.div 
                            key={doc.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`bg-white rounded-[2.5rem] overflow-hidden transition-all border border-gray-100 flex flex-col h-full shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] group ${isRequested ? 'ring-2 ring-amber-500 border-amber-200' : ''}`}
                        >
                            {/* Visual Preview */}
                            <div className="h-32 bg-gray-50 relative overflow-hidden flex items-center justify-center shrink-0">
                                {isUploaded && isImage ? (
                                    <img src={fileUrl} alt={doc.label} className="w-full h-full object-cover transition-transform duration-500" />
                                ) : isUploaded ? (
                                    <File className="w-12 h-12 text-primary-200 transition-transform duration-500" />
                                ) : (
                                    <AlertCircle className="w-12 h-12 text-gray-200" />
                                )}
                                
                                <div className="absolute top-4 right-4">
                                    {isRequested ? (
                                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                    ) : isUploaded ? (
                                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h4 className="font-black text-gray-900 text-sm mb-1 tracking-tight">{doc.label}</h4>
                                <div className="mb-4">
                                    {isRequested ? (
                                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Flagged</span>
                                    ) : isUploaded ? (
                                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Verified Vault</span>
                                    ) : (
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Unresolved</span>
                                    )}
                                </div>

                                {isUploaded ? (
                                    <div className="mt-auto pt-4 border-t border-gray-50 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                                                <Image className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black text-gray-900 truncate" title={meta.originalName}>{meta.originalName}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(meta.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <a 
                                                href={fileUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex-1 py-2 bg-gray-900 text-white text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-gray-200"
                                            >
                                                Preview
                                            </a>
                                            <a 
                                                href={fileUrl} 
                                                download={meta.originalName} 
                                                className="flex-1 py-2 bg-white text-gray-500 border border-gray-100 text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                            >
                                                Fetch
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs font-bold text-gray-400 mt-auto pt-4 italic">Awaiting document submission...</p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {applicationStatus === 'draft' && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-gray-100 rounded-[2rem] p-8 text-center shadow-sm"
                >
                    <p className="text-sm font-bold text-gray-500 mb-4">Incomplete Enrollment detected</p>
                    <Link to="/app/student/admission/form" className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                        Complete Form <ExternalLink className="w-4 h-4" />
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

export default MyDocumentsPage;
