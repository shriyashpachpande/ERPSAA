import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../../utils/axiosInstance';
import { CreditCard, CheckCircle, AlertCircle, Clock, Download, ChevronRight, Receipt, ArrowUpRight, Home, ShieldCheck, Loader2, Smartphone, QrCode, Lock, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';

const StatCard = ({ title, value, icon: Icon, color, subText }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="bg-gray-50 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Live
            </div>
        </div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">₹{value.toLocaleString()}</h3>
        {subText && <p className="text-xs text-gray-400 mt-2 font-medium">{subText}</p>}
    </div>
);

const StudentFeeOverviewPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cardsRef = useRef(null);
    const tableRef = useRef(null);

    // Payment states
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState('checkout'); // 'checkout', 'otp', 'processing', 'success'
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi'
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [upiId, setUpiId] = useState('');
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);

    // Timer countdown for Bank OTP Screen
    useEffect(() => {
        let interval = null;
        if (showPaymentModal && paymentStep === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [showPaymentModal, paymentStep, timer]);

    const triggerPaymentModal = async (inst) => {
        try {
            setSelectedInstallment(inst);
            setPaymentStep('processing');
            setShowPaymentModal(true);
            
            const res = await axiosInstance.post('/fees/payments/create-checkout-session', {
                feeAccountId: account._id,
                installmentId: inst._id,
                amount: inst.amount
            });

            if (res.data.success && res.data.url) {
                // Redirect browser directly to Stripe Sandbox Checkout Page!
                window.location.href = res.data.url;
            } else {
                alert('Failed to generate payment session URL');
                setShowPaymentModal(false);
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Stripe Session Initiation Failed');
            setShowPaymentModal(false);
        }
    };

    const verifyStripePayment = async (sessionId) => {
        try {
            setPaymentStep('processing');
            setShowPaymentModal(true);
            
            const res = await axiosInstance.post('/fees/payments/verify-checkout-session', {
                sessionId
            });

            if (res.data.success) {
                setPaymentStep('success');
                // Clean the query parameters from URL without page reload
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
                
                setTimeout(() => {
                    setShowPaymentModal(false);
                    fetchFeeData();
                }, 3000);
            } else {
                alert('Stripe verification failed.');
                setShowPaymentModal(false);
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Stripe verification failed');
            setShowPaymentModal(false);
        }
    };

    useEffect(() => {
        fetchFeeData();

        // Check if redirected back from Stripe with session details
        const queryParams = new URLSearchParams(window.location.search);
        const success = queryParams.get('success');
        const sessionId = queryParams.get('session_id');

        if (success === 'true' && sessionId) {
            verifyStripePayment(sessionId);
        }
    }, []);

    const fetchFeeData = async () => {
        try {
            const res = await axiosInstance.get('/fees/my-fees');
            if (res.data.success) {
                if (res.data.initialized === false) {
                    // It's a success but not initialized yet
                    setData(null);
                    setLoading(false);
                    return;
                }
                setData(res.data.data);
            }
            
            // GSAP Animations
            setTimeout(() => {
                if (cardsRef.current) {
                    gsap.fromTo(cardsRef.current.children, 
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
                    );
                }
                if (tableRef.current) {
                    gsap.fromTo(tableRef.current,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' }
                    );
                }
            }, 100);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load fee data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    if (!loading && !error && !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-10 bg-white rounded-[3rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="p-6 bg-primary-50 rounded-full">
                    <Clock className="w-12 h-12 text-primary-500" />
                </div>
                <div className="text-center max-w-sm">
                    <h3 className="text-2xl font-black text-gray-900 italic">Account Not Assigned.</h3>
                    <p className="text-gray-500 font-medium mt-2">
                        Your fee account has not been assigned by the accounts department yet. Please contact the accounts office to initialize your ledger.
                    </p>
                </div>
                <button type="button" onClick={fetchFeeData} className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">
                    Check Status
                </button>
            </div>
        );
    }

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-10 bg-white rounded-[3rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="p-6 bg-amber-50 rounded-full">
                <AlertCircle className="w-12 h-12 text-amber-500" />
            </div>
            <div className="text-center max-w-sm">
                <h3 className="text-2xl font-black text-gray-900 italic">Account Pending.</h3>
                <p className="text-gray-500 font-medium leading-relaxed mt-2">
                    {error.includes('not initialized') 
                        ? "Your institutional fee account is being set up by the accounts department. Please check back shortly." 
                        : error}
                </p>
            </div>
            <button type="button" onClick={fetchFeeData} className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                Refresh Status
            </button>
        </div>
    );

    const { account, payments } = data;


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Fee Summary</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Track your institutional fees and payment history.</p>
                </div>
                <div className="bg-brand-dark px-4 py-2 rounded-2xl flex items-center gap-3 border border-white/10 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Status: {account.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            {/* KPI Cards */}
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Payable" 
                    value={account.totalPayable} 
                    icon={CreditCard} 
                    color="bg-indigo-50 text-indigo-600" 
                    subText={`${account.feeStructureId?.academicYear || 'Current'} Academic Session`}
                />
                <StatCard 
                    title="Amount Paid" 
                    value={account.totalPaid} 
                    icon={CheckCircle} 
                    color="bg-emerald-50 text-emerald-600"
                    subText={`Last payment on ${payments[0] ? new Date(payments[0].paymentDate).toLocaleDateString() : 'N/A'}`}
                />
                <StatCard 
                    title="Outstanding Balance" 
                    value={account.balance} 
                    icon={Clock} 
                    color="bg-rose-50 text-rose-600"
                    subText={account.balance > 0 ? 'Pending dues observed' : 'All clear!'}
                />
            </div>

            {/* Payment History */}
            <div ref={tableRef} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                        <p className="text-sm font-medium text-gray-500">Your latest fee payment history.</p>
                    </div>
                    <Receipt className="w-8 h-8 text-gray-200" />
                </div>
                
                {/* Installment Schedule */}
                <div className="p-8 bg-primary-50/30 border-b border-primary-50">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-primary-600" />
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Installment Schedule</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {account.installments && account.installments.map((inst, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-primary-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Due {new Date(inst.dueDate).toLocaleDateString()}</p>
                                    <p className="text-sm font-black text-gray-900">₹{inst.amount.toLocaleString()}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2 py-1 rounded-lg text-[8.5px] font-black uppercase tracking-tighter ${
                                        inst.status === 'paid' 
                                            ? 'bg-emerald-100 text-emerald-700' 
                                            : inst.status === 'verification_pending' 
                                                ? 'bg-amber-100 text-amber-700 animate-pulse border border-amber-300' 
                                                : 'bg-rose-100 text-rose-700 border border-rose-200'
                                    }`}>
                                        {inst.status === 'verification_pending' ? 'Pending Approval' : inst.status}
                                    </span>
                                    {inst.status === 'pending' && (
                                        <button type="button" 
                                            onClick={() => triggerPaymentModal(inst)}
                                            className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[8.5px] font-black uppercase tracking-widest transition-all shadow-sm"
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Hostel & Other Charges */}
                    {account.hostelCharges && account.hostelCharges.length > 0 && (
                        <div className="pt-4 border-t border-primary-100">
                             <div className="flex items-center gap-2 mb-4">
                                <Home className="w-4 h-4 text-indigo-600" />
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Hostel & Other Charges</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {account.hostelCharges.map((charge, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{charge.description}</p>
                                            <p className="text-sm font-black text-gray-900">₹{charge.amount.toLocaleString()}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${charge.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {charge.status}
                                            </span>
                                            {charge.status === 'pending' && (
                                                <button 
                                                    onClick={() => triggerPaymentModal(charge)}
                                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[8.5px] font-black uppercase tracking-widest transition-all shadow-sm"
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Mode</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.length > 0 ? payments.map((p, i) => (
                                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-gray-900">{new Date(p.paymentDate).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-400 font-medium">{new Date(p.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-lg font-black text-gray-900">₹{p.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wider">
                                            {p.paymentMode.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-mono text-xs text-gray-500">
                                        {p.transactionId || '---'}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Success</span>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-gray-50 rounded-full">
                                                <CreditCard className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No transactions found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex justify-center">
                    <button type="button" 
                        onClick={() => window.location.href = '/app/student/fees/receipts'}
                        className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest"
                    >
                        View Digital Receipts <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Dynamic Stripe-inspired Checkout Modal */}
            {showPaymentModal && selectedInstallment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 backdrop-blur-md bg-black/60 overflow-y-auto animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 duration-500 grid grid-cols-1 md:grid-cols-5 min-h-[600px]">
                        
                        {/* Left Side (Stripe Product Summary) */}
                        <div className="md:col-span-2 bg-[#F8F9FA] p-8 md:p-12 flex flex-col justify-between border-r border-gray-100">
                            <div>
                                {/* Header with back arrow */}
                                <button type="button" 
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-xs font-bold uppercase tracking-wider mb-8 cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to ERPSAA
                                </button>

                                {/* Brand & Sandbox badge */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white text-[10px] font-black">E</div>
                                    <span className="text-sm font-black text-gray-800 tracking-tight">QuickShow sandbox</span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-extrabold uppercase tracking-wider">Sandbox</span>
                                </div>

                                {/* Product details */}
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Tuition Fee Clearance</p>
                                <h3 className="text-lg font-black text-gray-900 leading-tight">Tuition Fee Installment</h3>
                                
                                {/* Amount */}
                                <div className="mt-8">
                                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight">₹{selectedInstallment.amount.toLocaleString()}.00</span>
                                </div>
                            </div>

                            {/* Secure Info Footer */}
                            <div className="text-[10px] text-gray-400 font-medium flex items-center gap-2 mt-8 md:mt-0">
                                <Lock className="w-3.5 h-3.5" /> Powered by Stripe • Secure Sandbox Mode
                            </div>
                        </div>

                        {/* Right Side (Stripe Form & Content) */}
                        <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-between bg-white relative">
                            {paymentStep === 'checkout' && (
                                <form onSubmit={handleCheckoutSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        {/* Pay with Link brand button */}
                                        <button 
                                            type="button"
                                            className="w-full py-3 bg-[#00D66F] hover:bg-[#00c566] text-white rounded-lg font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                        >
                                            Pay with <span className="font-mono font-extrabold tracking-tight">⚡ link</span>
                                        </button>

                                        {/* Divider */}
                                        <div className="flex items-center justify-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-widest my-4">
                                            <div className="h-px bg-gray-100 flex-1"></div>
                                            OR
                                            <div className="h-px bg-gray-100 flex-1"></div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Contact information</h4>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email address</label>
                                                <input 
                                                    disabled 
                                                    type="email" 
                                                    value="virajmathpati2022@erpsaa.com" 
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-400 outline-none" 
                                                />
                                            </div>
                                        </div>

                                        {/* Payment Method */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Payment method</h4>
                                            
                                            {/* Stripe Card Field Box */}
                                            <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-[#635BFF]/10 focus-within:border-[#635BFF] transition-all bg-white">
                                                <div className="relative border-b border-gray-150">
                                                    <input 
                                                        required 
                                                        type="text" 
                                                        maxLength="19" 
                                                        placeholder="Card number" 
                                                        value={cardNumber} 
                                                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())} 
                                                        className="w-full px-4 py-4 text-xs font-bold text-gray-900 outline-none placeholder:text-gray-300 placeholder:font-medium bg-white" 
                                                    />
                                                    {/* Card Brand Logopack */}
                                                    <div className="absolute right-4 top-4 flex items-center gap-1.5 opacity-60">
                                                        <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase">Visa</span>
                                                        <span className="text-[8px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded uppercase">MC</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <input 
                                                        required 
                                                        type="text" 
                                                        maxLength="5" 
                                                        placeholder="MM / YY" 
                                                        value={cardExpiry} 
                                                        onChange={(e) => setCardExpiry(e.target.value)} 
                                                        className="px-4 py-4 text-xs font-bold text-gray-900 outline-none border-r border-gray-150 text-center placeholder:text-gray-300 placeholder:font-medium bg-white" 
                                                    />
                                                    <input 
                                                        required 
                                                        type="password" 
                                                        maxLength="3" 
                                                        placeholder="CVC" 
                                                        value={cardCvv} 
                                                        onChange={(e) => setCardCvv(e.target.value)} 
                                                        className="px-4 py-4 text-xs font-bold text-gray-900 outline-none text-center placeholder:text-gray-300 placeholder:font-medium bg-white" 
                                                    />
                                                </div>
                                            </div>

                                            {/* Cardholder Name */}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                                                <input 
                                                    required
                                                    type="text" 
                                                    placeholder="Full name on card" 
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 placeholder:text-gray-300 placeholder:font-medium bg-white" 
                                                />
                                            </div>

                                            {/* Country or Region */}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Country or region</label>
                                                <select 
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 bg-white outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 cursor-pointer"
                                                >
                                                    <option>India</option>
                                                    <option>United States</option>
                                                    <option>United Kingdom</option>
                                                </select>
                                            </div>

                                            {/* Save info checkbox */}
                                            <div className="flex items-start gap-3 pt-2">
                                                <input type="checkbox" defaultChecked id="saveInfo" className="w-4 h-4 border border-gray-200 rounded text-[#635BFF] focus:ring-[#635BFF] cursor-pointer" />
                                                <label htmlFor="saveInfo" className="text-[10px] font-medium text-gray-500 leading-snug cursor-pointer">
                                                    Save my information for faster checkout. Securely saved at QuickShow Sandbox.
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stripe Action Button */}
                                    <div className="pt-6 border-t border-gray-100 mt-6">
                                        <button 
                                            type="submit" 
                                            className="w-full py-3.5 bg-[#635BFF] hover:bg-[#5851eb] text-white rounded-lg font-black uppercase tracking-widest text-xs transition-all shadow-md shadow-indigo-900/10 cursor-pointer"
                                        >
                                            Pay ₹{selectedInstallment.amount.toLocaleString()}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* OTP Step (Bank Authentication Screen Mockup) */}
                            {paymentStep === 'otp' && (
                                <form onSubmit={handleOtpSubmit} className="space-y-8 flex-1 flex flex-col justify-between">
                                    <div className="space-y-6 text-center py-6">
                                        <div className="mx-auto w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100">
                                            <Smartphone className="w-6 h-6 animate-bounce" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Bank Verification</h4>
                                            <p className="text-[10px] font-medium text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                                                We've sent an SMS verification code to your registered mobile ending in <b>*8006</b>
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <input 
                                                required 
                                                type="text" 
                                                maxLength="6" 
                                                placeholder="Enter 6-digit OTP" 
                                                value={otp} 
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-amber-400 text-center tracking-[0.5em] font-black text-xl text-gray-900 placeholder:text-gray-200 placeholder:tracking-normal" 
                                            />
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                                Resend OTP in <span className="text-amber-500 font-black">{timer}s</span>
                                            </p>
                                        </div>
                                        <div className="p-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl">
                                             <p className="text-[9.5px] font-black text-amber-700 leading-relaxed uppercase tracking-wider">
                                                 💡 Hint: Enter <b>123456</b> or any 6 digits to verify!
                                             </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-gray-50">
                                        <button 
                                            type="submit" 
                                            className="w-full py-4 bg-[#635BFF] hover:bg-[#5851eb] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg cursor-pointer"
                                        >
                                            Verify & Authorize Payment
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setPaymentStep('checkout')}
                                            className="w-full py-3 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all cursor-pointer"
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Processing Step */}
                            {paymentStep === 'processing' && (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12 text-center animate-in fade-in duration-300">
                                    <div className="p-6 bg-primary-50 rounded-full border border-primary-100 relative">
                                        <Loader2 className="w-10 h-10 text-[#635BFF] animate-spin" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Stripe Gateway Active</h4>
                                        <p className="text-[10px] font-medium text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
                                            Redirecting you to Stripe's secure checkout environment, or verifying your captured payment status. Please do not close or reload...
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Success Step */}
                            {paymentStep === 'success' && (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12 text-center animate-in zoom-in duration-500">
                                    <div className="p-6 bg-emerald-50 rounded-full border border-emerald-100 shadow-[0_0_20px_5px_rgba(16,185,129,0.1)]">
                                        <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Payment Successful!</h4>
                                        <p className="text-[10px] font-medium text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
                                            Your transaction has been securely captured by Stripe and successfully posted to your institutional ledger. Balance updated!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFeeOverviewPage;
