import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Printer,
    Download,
    CheckCircle2,
    ShieldCheck,
    Calendar,
    User,
    CreditCard,
    Loader2
} from 'lucide-react';
import gsap from 'gsap';

const DigitalReceiptPage = () => {
    const { receiptId } = useParams();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/fees/my-receipts/${receiptId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReceipt(res.data.data);
            } catch (err) {
                setError('Could not retrieve receipt. It may not belong to you.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReceipt();
    }, [receiptId]);

    useEffect(() => {
        if (receipt) {
            gsap.from(".receipt-paper", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        }
    }, [receipt]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Generating Digital Document...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center space-y-6">
            <div className="p-6 bg-rose-50 rounded-full">
                <ShieldCheck className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 italic">Access Denied.</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{error}</p>
            <button type="button" onClick={() => window.history.back()} className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                Go Back
            </button>
        </div>
    );

    const { paymentEntryId: payment, studentId: student } = receipt;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 print:bg-white print:p-0">
            {/* Action Bar (Hidden on Print) */}
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
                <button type="button"
                    onClick={() => window.history.back()}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                <div className="flex gap-3">
                    <button type="button"
                        onClick={handlePrint}
                        className="flex items-center gap-3 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                    >
                        <Printer className="w-4 h-4" /> Print Receipt
                    </button>
                </div>
            </div>

            {/* Receipt Paper */}
            <div className="receipt-paper max-w-4xl mx-auto bg-white rounded-[3rem] shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
                {/* Receipt Header */}
                <div className="p-12 bg-brand-dark text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <ShieldCheck className="w-48 h-48" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-primary-900/50">ER.</div>
                                <h1 className="text-3xl font-black tracking-tighter italic">ERPSAA.</h1>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest text-primary-400">Digital Fee Acknowledgement</p>
                                <h2 className="text-5xl font-black tracking-tighter">#{receipt.receiptNumber}</h2>
                            </div>
                        </div>
                        <div className="text-left md:text-right space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Date of Issue</p>
                            <p className="text-xl font-bold">{new Date(receipt.generatedAt).toLocaleDateString()}</p>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-2 flex items-center md:justify-end gap-2">
                                <CheckCircle2 className="w-3 h-3" /> Digitally Verified
                            </p>
                        </div>
                    </div>
                </div>

                {/* Receipt Body */}
                <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Student Info */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Paid By</p>
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center border border-gray-100">
                                    <User className="w-8 h-8 text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-none mb-1">{student.personalDetails.fullName}</h3>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">ID: {student.studentId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 p-8 bg-gray-50 rounded-[2.5rem]">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Course</p>
                                <p className="font-bold text-gray-900 uppercase text-xs">{student.academicProfile.course}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Year</p>
                                <p className="font-bold text-gray-900 uppercase text-xs">{student.academicProfile.year}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Transaction Details</p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Payment Mode</span>
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{payment.paymentMode.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Reference No.</span>
                                    <span className="text-xs font-mono font-bold text-gray-900">{payment.transactionId || 'WALK-IN'}</span>
                                </div>
                                <div className="flex justify-between items-center p-6 bg-primary-50 rounded-3xl border border-primary-100/50">
                                    <span className="text-xs font-black text-primary-600 uppercase tracking-widest italic">Amount Received</span>
                                    <span className="text-3xl font-black text-primary-600 tracking-tighter">₹{payment.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 border border-dashed border-gray-200 rounded-2xl">
                            <ShieldCheck className="w-5 h-5 text-gray-300" />
                            <p className="text-[10px] font-medium text-gray-400">This is a system generated acknowledgement. No physical signature is required.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-12 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="text-sm font-black text-gray-900">Institutional Accounts Office</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ERPSAA Smart Campus ERP</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-center mt-12 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] print:hidden">End of Document</p>
        </div>
    );
};

export default DigitalReceiptPage;
