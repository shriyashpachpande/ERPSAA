import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, AlertCircle, Clock, Download, ChevronRight, Receipt, ArrowUpRight, Home } from 'lucide-react';
import gsap from 'gsap';

const API_BASE = 'http://localhost:5000/api/fees';

const StudentFeeOverviewPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cardsRef = useRef(null);
    const tableRef = useRef(null);

    useEffect(() => {
        fetchFeeData();
    }, []);

    const fetchFeeData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/my-fees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
                <button onClick={fetchFeeData} className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">
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
            <button onClick={fetchFeeData} className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                Refresh Status
            </button>
        </div>
    );

    const { account, payments } = data;

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
                                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${inst.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {inst.status}
                                </span>
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
                                        <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${charge.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {charge.status}
                                        </span>
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
                    <button 
                        onClick={() => window.location.href = '/app/student/fees/receipts'}
                        className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest"
                    >
                        View Digital Receipts <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentFeeOverviewPage;
