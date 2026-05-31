import React, { useEffect, useState } from 'react';
import { Search, Filter, DollarSign, User, BookOpen, Clock, AlertTriangle, CheckCircle, Receipt, MoreVertical, XCircle, ShieldCheck } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';

const StaffFineManagementPage = () => {
    const { getFines, collectFine, waiveFine, loading } = useLibrary();
    const [fines, setFines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFine, setSelectedFine] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [actionReason, setActionReason] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');

    const fetchFines = async () => {
        try {
            const res = await getFines();
            setFines(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFines();
    }, []);

    const filtered = fines.filter(f => {
        const matchesSearch = f.studentId?.personalDetails?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             f.studentId?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             f.fineId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'ALL' || (activeTab === 'UNPAID' && (f.status === 'UNPAID' || f.status === 'PARTIAL')) || (activeTab === 'PAID' && f.status === 'PAID');
        return matchesSearch && matchesTab;
    });

    const handleCollect = async () => {
        if (!paymentAmount || isNaN(paymentAmount)) return;
        try {
            await collectFine({
                fineId: selectedFine._id,
                amount: Number(paymentAmount),
                notes: actionReason
            });
            setSelectedFine(null);
            setPaymentAmount('');
            setActionReason('');
            fetchFines();
        } catch (err) {
            console.error(err);
        }
    };

    const handleWaive = async () => {
        if (!actionReason) return;
        try {
            await waiveFine({
                fineId: selectedFine._id,
                reason: actionReason
            });
            setSelectedFine(null);
            setActionReason('');
            fetchFines();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark tracking-tight">Fine Management</h1>
                    <p className="text-gray-500 font-medium">Control penalties, collect payments, and manage waivers</p>
                </div>
                
                <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                    {['ALL', 'UNPAID', 'PAID'].map(tab => (
                        <button type="button" 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                                activeTab === tab ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by student name, ID or receipt..." 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fine Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Financials</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-right font-medium text-gray-400"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {filtered.map(f => (
                                <tr key={f._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-black text-xs uppercase">
                                                {f.studentId?.personalDetails?.fullName?.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-dark leading-tight">{f.studentId?.personalDetails?.fullName}</p>
                                                <p className="text-[10px] text-gray-400 font-black tracking-widest">{f.studentId?.studentId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-1">
                                            <p className="font-bold text-gray-700 truncate max-w-[200px]">{f.bookId?.title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-primary-600 uppercase tracking-tighter">{f.fineType}</span>
                                                <span className="text-[10px] text-gray-300">•</span>
                                                <span className="text-[10px] text-gray-400 font-bold">{new Date(f.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Total</p>
                                                <p className="font-black text-gray-700">₹{f.amount}</p>
                                            </div>
                                            <div className="h-6 w-px bg-gray-100"></div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-red-400 leading-none mb-1">Pending</p>
                                                <p className="font-black text-red-600">₹{f.remainingAmount}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            f.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                            f.status === 'WAIVED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            {f.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {(f.status === 'UNPAID' || f.status === 'PARTIAL') && (
                                            <button type="button" 
                                                onClick={() => setSelectedFine(f)}
                                                className="p-2.5 bg-white border border-gray-200 rounded-xl text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all shadow-sm"
                                            >
                                                <DollarSign className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment / Waiver Actions */}
            {selectedFine && (
                <div className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-xl w-full rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 bg-brand-dark text-white relative">
                            <button type="button" onClick={() => setSelectedFine(null)} className="absolute top-8 right-8 text-white/40 hover:text-white">
                                <XCircle className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/10 rounded-2xl border border-white/5">
                                    <Receipt className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-400">Manage Settlement</p>
                                    <h3 className="text-xl font-black">#{selectedFine.fineId}</h3>
                                </div>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="opacity-60 font-bold">Outstanding Balance</span>
                                    <span className="text-2xl font-black text-red-400">₹{selectedFine.remainingAmount}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs opacity-60">
                                    <span>Issued To: {selectedFine.studentId.personalDetails.fullName}</span>
                                    <span>({selectedFine.studentId.studentId})</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Settle Amount (INR)</label>
                                <input 
                                    type="number" 
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-500 outline-none text-2xl font-black text-brand-dark transition-all"
                                    placeholder="Enter amount..."
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Transaction Notes / Reason</label>
                                <textarea 
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-500 outline-none font-bold text-sm h-24 resize-none transition-all"
                                    placeholder="Add any remarks or waiver justification..."
                                    value={actionReason}
                                    onChange={(e) => setActionReason(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" 
                                    onClick={handleCollect}
                                    className="p-5 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-3 disabled:opacity-50"
                                    disabled={!paymentAmount || loading}
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Collect Payment
                                </button>
                                <button type="button" 
                                    onClick={handleWaive}
                                    className="p-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 disabled:opacity-50"
                                    disabled={!actionReason || loading}
                                >
                                    <ShieldCheck className="w-5 h-5" />
                                    Waive Entirely
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                                <AlertTriangle className="w-3 h-3 inline mr-1 mb-1 text-orange-400" />
                                Only super administrators can waive library fines.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffFineManagementPage;
