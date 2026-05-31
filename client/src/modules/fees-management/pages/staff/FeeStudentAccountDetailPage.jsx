import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../utils/axiosInstance';
import { 
    ArrowLeft, CreditCard, Receipt, FileText, CheckCircle, 
    AlertCircle, Download, Printer, Plus, Trash2, Home, Clock, ShieldCheck
} from 'lucide-react';
import gsap from 'gsap';

const FeeStudentAccountDetailPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const detailRef = useRef(null);

    // Form state
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('online');
    const [txId, setTxId] = useState('');
    const [remarks, setRemarks] = useState('');
    const [saving, setSaving] = useState(false);

    // Pending student claims state
    const [pendingClaims, setPendingClaims] = useState([]);
    const [activeClaimId, setActiveClaimId] = useState(null);

    useEffect(() => {
        fetchAccountDetail();
        fetchPendingClaims();
    }, [id]);

    const fetchPendingClaims = async () => {
        try {
            const res = await axiosInstance.get(`/fees/staff/students/${id}/payment-requests`);
            if (res.data.success) {
                setPendingClaims(res.data.data.filter(c => c.status === 'pending'));
            }
        } catch (err) {
            console.error('Failed to load pending claims', err);
        }
    };

    const fetchAccountDetail = async () => {
        try {
            const res = await axiosInstance.get(`/fees/staff/students/${id}`);
            setData(res.data.data);
            
            setTimeout(() => {
                if (detailRef.current) {
                    gsap.fromTo(detailRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
                }
            }, 100);
        } catch (err) {
            console.error('Failed to load detail', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (activeClaimId) {
                // Post to approve payment request endpoint!
                await axiosInstance.post(`/fees/staff/payment-requests/${activeClaimId}/approve`, {
                    remarks
                });
            } else {
                // Normal manual payment post
                await axiosInstance.post('/fees/staff/payments', {
                    feeAccountId: id,
                    amount: Number(amount),
                    paymentMode: method,
                    transactionId: txId,
                    remarks
                });
            }
            
            setShowModal(false);
            setAmount(''); setTxId(''); setRemarks('');
            setActiveClaimId(null);
            fetchAccountDetail();
            fetchPendingClaims();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to process payment');
        } finally {
            setSaving(false);
        }
    };

    const handleRejectClaim = async (claimId) => {
        const reason = prompt("Enter rejection reason for this claim:");
        if (!reason) return;
        
        try {
            await axiosInstance.post(`/fees/staff/payment-requests/${claimId}/reject`, {
                rejectionReason: reason
            });
            
            fetchAccountDetail();
            fetchPendingClaims();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to reject claim');
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading student ledger...</div>;

    const { account, payments, receipts } = data;

    return (
        <div ref={detailRef} className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-6">
                <button type="button" onClick={() => window.history.back()} className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-gray-500 shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Student Ledger</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Managing account for {account.studentId.personalDetails?.fullName}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white relative">
                   <div className="lg:col-span-1 bg-brand-dark p-8 rounded-[2.5rem] shadow-xl border border-white/5 space-y-8">
                        <div>
                            <div className="w-20 h-20 rounded-3xl bg-primary-600 flex items-center justify-center text-3xl font-black shadow-lg mb-6">
                                {account.studentId.personalDetails?.fullName?.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">{account.studentId.personalDetails?.fullName}</h2>
                            <p className="text-white/40 font-bold text-xs uppercase tracking-widest mt-1">{account.studentId.studentId}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Course</p>
                                 <p className="font-bold text-sm">{account.studentId.academicProfile.course}</p>
                             </div>
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Year</p>
                                 <p className="font-bold text-sm">{account.academicYear}</p>
                             </div>
                        </div>

                        <hr className="border-white/5" />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-white/40 uppercase">Total Payable</span>
                                <span className="text-xl font-black">₹{account.totalPayable.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-emerald-400 uppercase">Total Paid</span>
                                <span className="text-xl font-black text-emerald-400">₹{account.totalPaid.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-6 bg-white/5 rounded-[2rem] border border-white/10">
                                <span className="text-xs font-black uppercase text-rose-400 tracking-widest">Balance</span>
                                <span className="text-3xl font-black text-rose-400 tracking-tighter">₹{account.balance.toLocaleString()}</span>
                            </div>
                        </div>

                        <button type="button" 
                            onClick={() => {
                                setActiveClaimId(null);
                                setAmount('');
                                setTxId('');
                                setRemarks('');
                                setMethod('online');
                                setShowModal(true);
                            }}
                            className="w-full py-5 bg-primary-600 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-primary-500 transition-all shadow-2xl shadow-primary-900 group"
                        >
                            <Plus className="w-5 h-5 mx-auto mb-1 group-hover:rotate-90 transition-transform" />
                            Record New Payment
                        </button>
                   </div>

                   <div className="lg:col-span-2 space-y-8">
                        {/* Pending Verification Claims Queue */}
                        {pendingClaims.length > 0 && (
                            <div className="bg-brand-dark/95 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-6 animate-in fade-in duration-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
                                            <h3 className="text-2xl font-black text-white tracking-tight">Pending Fee Verification</h3>
                                        </div>
                                        <p className="text-sm font-medium text-white/50">Verify student submitted online transaction clearances.</p>
                                    </div>
                                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                                </div>

                                <div className="space-y-4">
                                    {pendingClaims.map((claim) => (
                                        <div key={claim._id} className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/10 transition-all">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-white/40 uppercase tracking-wider">UTN/Ref:</span>
                                                    <span className="font-mono text-xs font-bold text-white tracking-wider">{claim.transactionId}</span>
                                                </div>
                                                <p className="text-2xl font-black text-white mt-1">₹{claim.amount.toLocaleString()}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-md text-[8px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-1">
                                                        <ShieldCheck className="w-2.5 h-2.5" /> Gateway Verified Match
                                                    </span>
                                                    <span className="text-[10px] text-white/40 font-bold">Submitted {new Date(claim.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 w-full md:w-auto">
                                                <button type="button"
                                                    onClick={() => {
                                                        setActiveClaimId(claim._id);
                                                        setAmount(claim.amount.toString());
                                                        setTxId(claim.transactionId);
                                                        setMethod('online');
                                                        setRemarks('Gateway secure match verified. Clear and post.');
                                                        setShowModal(true);
                                                    }}
                                                    className="flex-1 md:flex-none px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md"
                                                >
                                                    Verify & Clear
                                                </button>
                                                <button type="button"
                                                    onClick={() => handleRejectClaim(claim._id)}
                                                    className="flex-1 md:flex-none px-5 py-3 bg-white/5 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl border border-white/5 hover:border-rose-500/30 text-[10px] font-black uppercase tracking-wider transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Installment Schedule */}
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                 <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Financial Timeline</h3>
                                    <p className="text-sm font-medium text-gray-500">Scheduled installments and their collection status.</p>
                                 </div>
                                 <Clock className="w-10 h-10 text-gray-100" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {account.installments && account.installments.map((inst, idx) => (
                                    <div key={idx} className={`p-6 rounded-[2rem] border-2 transition-all flex justify-between items-center ${inst.status === 'paid' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Installment {idx + 1}</p>
                                            <p className="text-xl font-black text-gray-900 leading-none">₹{inst.amount.toLocaleString()}</p>
                                            <p className="text-[10px] font-bold text-gray-500 mt-2 italic">Due on {new Date(inst.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${inst.status === 'paid' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                            {inst.status}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Hostel & Other Charges */}
                            {account.hostelCharges && account.hostelCharges.length > 0 && (
                                <div className="pt-8 border-t border-gray-50">
                                     <div className="flex items-center gap-2 mb-6">
                                        <Home className="w-5 h-5 text-indigo-600" />
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Hostel & Miscellaneous Charges</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {account.hostelCharges.map((charge, idx) => (
                                            <div key={idx} className={`p-6 rounded-[2rem] border-2 transition-all flex justify-between items-center ${charge.status === 'paid' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-indigo-50/30 border-indigo-100/50'}`}>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{charge.description}</p>
                                                    <p className="text-xl font-black text-gray-900 leading-none">₹{charge.amount.toLocaleString()}</p>
                                                    <p className="text-[10px] font-bold text-gray-500 mt-2 italic">Added on {new Date(charge.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${charge.status === 'paid' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>
                                                    {charge.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* payment history */}
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 h-full min-h-[500px]">
                            <div className="flex items-center justify-between">
                                 <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Payment History</h3>
                                    <p className="text-sm font-medium text-gray-500">Chronological record of transactions.</p>
                                 </div>
                                 <FileText className="w-10 h-10 text-gray-100" />
                            </div>

                            <div className="space-y-4">
                                {payments.length > 0 ? payments.map((p) => (
                                    <div key={p._id} className="p-6 bg-gray-50 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-100/50 transition-all border border-transparent hover:border-gray-200 group">
                                         <div className="flex items-center gap-5">
                                             <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-emerald-600">
                                                 <CheckCircle className="w-6 h-6" />
                                             </div>
                                             <div>
                                                 <p className="text-sm font-black text-gray-900 leading-none mb-1">₹{p.amount.toLocaleString()}</p>
                                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(p.paymentDate).toLocaleDateString()} • {p.paymentMode.replace('_', ' ')}</p>
                                             </div>
                                         </div>
                                         <div className="flex items-center gap-4">
                                             <div className="text-right hidden md:block">
                                                 {receipts.find(r => r.paymentEntryId === p._id || r.paymentEntryId._id === p._id) && (
                                                     <p className="text-xs font-black text-primary-600 mb-1">{receipts.find(r => r.paymentEntryId === p._id || r.paymentEntryId._id === p._id).receiptNumber}</p>
                                                 )}
                                                 <p className="text-xs font-bold text-gray-500">{p.transactionId || 'No Ref ID'}</p>
                                                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Reference</p>
                                             </div>
                                             <button type="button" 
                                                onClick={() => {
                                                    const r = receipts.find(r => r.paymentEntryId === p._id || r.paymentEntryId._id === p._id);
                                                    if(r) window.open(`/app/student/fees/receipts/${r._id}`, '_blank');
                                                }}
                                                className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-primary-600 hover:border-primary-600 transition-all"
                                             >
                                                 <Printer className="w-4 h-4" />
                                             </button>
                                         </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center">
                                        <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No payments recorded yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* receipts panel */}
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                            <div className="flex items-center justify-between">
                                 <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Digital Receipts</h3>
                                    <p className="text-sm font-medium text-gray-500">Official document records for this account.</p>
                                 </div>
                                 <Receipt className="w-10 h-10 text-gray-100" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {receipts.length > 0 ? receipts.map((r) => (
                                    <div key={r._id} className="p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-primary-100 group transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                                <FileText className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <button type="button" className="text-primary-600 hover:text-primary-700 font-bold text-[10px] uppercase tracking-widest">
                                                Download
                                            </button>
                                        </div>
                                        <p className="text-xs font-black text-gray-900 mb-1">{r.receiptNumber}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Issued: {new Date(r.generatedAt).toLocaleDateString()}</p>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-10 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No receipts issued</p>
                                    </div>
                                )}
                            </div>
                        </div>
                   </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-black/40 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom-10 duration-500">
                        <div className="p-10 bg-brand-dark text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight italic">Record Payment.</h3>
                                <p className="text-xs font-black uppercase text-white/50 tracking-widest mt-1">Manual Transaction Entry</p>
                            </div>
                            <button type="button" onClick={() => setShowModal(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleAddPayment} className="p-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Payment Amount</label>
                                    <input required type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold text-gray-900" placeholder="0.00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Payment Mode</label>
                                    <select disabled={!!activeClaimId} value={method} onChange={(e)=>setMethod(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold text-gray-900">
                                        <option value="online">Online Transfer</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Transaction ID / Reference</label>
                                    <input type="text" value={txId} onChange={(e)=>setTxId(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold text-gray-900" placeholder="Enter Ref Number" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Staff Remarks</label>
                                    <textarea value={remarks} onChange={(e)=>setRemarks(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold text-gray-900 resize-none h-24" placeholder="Optional notes..."></textarea>
                                </div>
                            </div>
                            <button type="button" 
                                disabled={saving}
                                className="w-full py-5 bg-primary-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-primary-500/40 transition-all disabled:opacity-50"
                            >
                                {saving ? 'Finalizing Entry...' : 'Post Transaction & Generate Receipt'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeStudentAccountDetailPage;
