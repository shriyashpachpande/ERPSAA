import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Receipt, Download, Search, FileText, AlertCircle, Printer, Filter, ExternalLink } from 'lucide-react';
import gsap from 'gsap';

const API_BASE = 'http://localhost:5000/api/fees';

const StudentFeeReceiptHistoryPage = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const gridRef = useRef(null);

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/my-receipts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReceipts(res.data.data);
            
            // GSAP Animation
            setTimeout(() => {
                if (gridRef.current) {
                    gsap.fromTo(gridRef.current.children,
                        { opacity: 0, scale: 0.95, y: 10 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)' }
                    );
                }
            }, 100);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load receipts');
        } finally {
            setLoading(false);
        }
    };

    const filteredReceipts = receipts.filter(r => 
        r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Documents...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Digital Receipts</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Access and download your official fee payment records.</p>
                </div>
                
                <div className="relative group w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search receipt number..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-sm shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]" 
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center font-medium">
                    <AlertCircle className="w-5 h-5 mr-3" />
                    {error}
                </div>
            )}

            {/* Receipts Grid */}
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReceipts.length > 0 ? filteredReceipts.map((r) => (
                    <div key={r._id} className="bg-white group p-1 rounded-[2.5rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="p-7 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="p-4 bg-primary-50 rounded-3xl group-hover:scale-110 transition-transform duration-500">
                                    <Receipt className="w-8 h-8 text-primary-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Receipt No</p>
                                    <p className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{r.receiptNumber}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount Paid</span>
                                    <span className="text-xl font-black text-gray-900 tracking-tight">₹{r.paymentEntryId?.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-medium">
                                    <span className="text-gray-400">Date Issued</span>
                                    <span className="text-gray-900 font-bold">{new Date(r.generatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-medium">
                                    <span className="text-gray-400">Payment Mode</span>
                                    <span className="text-gray-900 font-bold capitalize">{r.paymentEntryId?.paymentMode.replace('_', ' ')}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all shadow-lg shadow-gray-200">
                                    <Printer className="w-4 h-4" /> Print
                                </button>
                                <button className="p-3 bg-primary-50 text-primary-600 rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-center px-6">
                        <div className="p-6 bg-white rounded-full shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] mb-4">
                            <FileText className="w-10 h-10 text-gray-200" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 uppercase tracking-tight">No Receipts Found</h4>
                        <p className="text-gray-400 text-sm font-medium mt-1">Once you make a payment, digital receipts will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentFeeReceiptHistoryPage;
