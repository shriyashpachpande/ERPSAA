import React, { useEffect, useState } from 'react';
import { Settings, Shield, Save, RotateCcw, AlertTriangle, Book, Calendar, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';

const AdminPolicyPage = () => {
    const { getActivePolicy, updatePolicy, loading } = useLibrary();
    const [policy, setPolicy] = useState(null);
    const [formData, setFormData] = useState({});
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const res = await getActivePolicy();
                setPolicy(res.data);
                setFormData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPolicy();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : Number(value) || value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePolicy(policy._id, formData);
            setStatus('success');
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            setStatus('error');
        }
    };

    if (!policy) return <div className="p-10 text-center animate-pulse font-bold">Loading Policies...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Shield className="w-5 h-5 text-primary-600" />
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Administrative Suite</span>
                    </div>
                    <h1 className="text-3xl font-black text-brand-dark tracking-tight">Library Policies</h1>
                </div>
                
                {status && (
                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-right-4 ${
                        status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                        {status === 'success' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {status === 'success' ? 'Policy Updated Successfully' : 'Update Failed'}
                    </div>
                )}
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Circulation Rules */}
                    <div className="glass-panel p-8 space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-primary-50 rounded-2xl text-primary-600 border border-primary-100">
                                <Book className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-brand-dark">Circulation Rules</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Max Books per Student</label>
                                <input name="studentMaxIssueLimit" type="number" className="policy-input" value={formData.studentMaxIssueLimit} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Standard Loan Period (Days)</label>
                                <input name="standardIssueDays" type="number" className="policy-input" value={formData.standardIssueDays} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Reference Loan Period (Days)</label>
                                <input name="referenceIssueDays" type="number" className="policy-input" value={formData.referenceIssueDays} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Fine Rules */}
                    <div className="glass-panel p-8 space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-red-50 rounded-2xl text-red-600 border border-red-100">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-brand-dark">Fine Rules</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fine per Overdue Day (INR)</label>
                                <input name="overdueFinePerDay" type="number" className="policy-input" value={formData.overdueFinePerDay} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Grace Period (Days)</label>
                                <input name="gracePeriodDays" type="number" className="policy-input" value={formData.gracePeriodDays} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Block Threshold (INR)</label>
                                <input name="fineThresholdForIssueBlock" type="number" className="policy-input" value={formData.fineThresholdForIssueBlock} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Reservation & Security */}
                    <div className="glass-panel p-8 space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-brand-dark">Reservation & Alerts</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Hold Window (Hours)</label>
                                <input name="reservationHoldHours" type="number" className="policy-input" value={formData.reservationHoldHours} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Overdue Item Block Count</label>
                                <input name="overdueBlockThreshold" type="number" className="policy-input" value={formData.overdueBlockThreshold} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Management Status */}
                    <div className="bg-brand-dark text-white p-10 rounded-[3rem] shadow-2xl flex flex-col justify-between overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Shield className="w-48 h-48 rotate-12" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-6">System Control</p>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm opacity-80">Apply Standard Policy</span>
                                    <input name="isActive" type="checkbox" className="w-6 h-6 accent-primary-600" checked={formData.isActive} onChange={handleChange} />
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <p className="text-xs font-medium opacity-40 leading-relaxed italic">
                                    Changes across library policies effect circulation immediately. Ensure all rules match the institution's charter.
                                </p>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="mt-10 w-full py-5 bg-primary-600 text-white rounded-3xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-3 active:scale-95 disabled:grayscale"
                        >
                            <Save className="w-6 h-6" />
                            {loading ? 'Committing...' : 'Apply Policies'}
                        </button>
                    </div>
                </div>
            </form>

            <style>{`
                .policy-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: #f9fafb;
                    border: 2px solid #f3f4f6;
                    border-radius: 1rem;
                    outline: none;
                    font-weight: 800;
                    color: #111827;
                    transition: all 0.2s;
                }
                .policy-input:focus {
                    background: white;
                    border-color: #4f46e5;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                }
            `}</style>
        </div>
    );
};

export default AdminPolicyPage;
