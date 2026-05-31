import React, { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck, XCircle, Trash2, Info, User, Book as BookIcon, CheckCircle, ArrowRight } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';

const StaffLostDamagedPage = () => {
    const { markLost, markDamaged, loading } = useLibrary();
    const [copyId, setCopyId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [notes, setNotes] = useState('');
    const [damageAmount, setDamageAmount] = useState('');
    const [actionStatus, setActionStatus] = useState('');

    const handleAction = async (type) => {
        if (!copyId) return;
        try {
            if (type === 'LOST') {
                await markLost(copyId, { studentId, notes });
            } else {
                await markDamaged(copyId, { studentId, amount: Number(damageAmount), notes });
            }
            setActionStatus('success');
            setTimeout(() => setActionStatus(''), 3000);
            // Reset form
            setCopyId('');
            setStudentId('');
            setNotes('');
            setDamageAmount('');
        } catch (err) {
            setActionStatus('error');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark tracking-tight/tight">Inventory Incident Report</h1>
                    <p className="text-gray-500 font-medium">Mark items as lost or damaged and apply penalties</p>
                </div>
                {actionStatus && (
                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-right-4 ${
                        actionStatus === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                        {actionStatus === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {actionStatus === 'success' ? 'Entry Recorded' : 'Action Failed'}
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="glass-panel p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Target Copy ID (Database ID)</label>
                            <div className="relative">
                                <BookIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none font-bold text-sm transition-all"
                                    placeholder="Enter Copy ID..."
                                    value={copyId}
                                    onChange={(e) => setCopyId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Responsible Student ID (Optional)</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none font-bold text-sm transition-all"
                                    placeholder="Enter Student ID for penalty..."
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Incident Notes / Appraisal</label>
                            <textarea 
                                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none font-bold text-sm h-32 resize-none transition-all"
                                placeholder="Describe the loss or damage details..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="space-y-6">
                    <div className="bg-red-50 border border-red-100 p-8 rounded-[3rem] space-y-4 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <XCircle className="w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-black text-red-700">Lost Item</h3>
                        <p className="text-red-600/70 text-xs font-bold leading-relaxed">
                            Marking an item as lost will remove it from the circulable inventory and automatically apply a loss penalty (₹500) to the student's record.
                        </p>
                        <button type="button" 
                            onClick={() => handleAction('LOST')}
                            disabled={!copyId || loading}
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:grayscale"
                        >
                            Confirm as Lost
                        </button>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-8 rounded-[3rem] space-y-6 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <AlertTriangle className="w-24 h-24" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-amber-700">Damaged Item</h3>
                            <p className="text-amber-600/70 text-xs font-bold leading-relaxed mt-2">
                                For damaged items that need repair or replacement. Specify an appraisal fee if a penalty should be applied.
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-amber-600/60 tracking-widest pl-1">Repair Appraisal Fee (INR)</label>
                            <input 
                                type="number"
                                className="w-full p-4 bg-white/50 border-2 border-amber-200 focus:border-amber-500 rounded-2xl outline-none font-black text-lg transition-all"
                                placeholder="0.00"
                                value={damageAmount}
                                onChange={(e) => setDamageAmount(e.target.value)}
                            />
                        </div>

                        <button type="button" 
                            onClick={() => handleAction('DAMAGED')}
                            disabled={!copyId || loading}
                            className="w-full py-4 bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 disabled:grayscale"
                        >
                            Confirm Damage
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] flex items-start gap-4">
                <Info className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                <div className="space-y-1">
                    <p className="font-black text-gray-700 uppercase tracking-widest text-[10px]">Staff Note</p>
                    <p className="text-gray-500 text-xs font-medium leading-relaxed">
                        Inventory incidents are permanent. Please verify the Copy ID carefully before recording. For major inventory reconciliations, contact the Super Admin.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaffLostDamagedPage;
