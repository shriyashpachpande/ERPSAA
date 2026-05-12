import React, { useState } from 'react';
import { Search, RotateCcw, User, Book as BookIcon, CheckCircle, AlertCircle, Calendar, Hash } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';

const ReturnBookPage = () => {
    const { returnBook, getIssuedBooks, loading } = useLibrary();
    const [searchQuery, setSearchQuery] = useState('');
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const res = await getIssuedBooks(searchQuery);
            setIssuedBooks(res.data);
            setSelectedTransaction(null);
            if (res.data.length === 0) {
                setStatus({ type: 'error', message: 'No active transactions found' });
            } else {
                setStatus({ type: '', message: '' });
            }
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Failed to search transactions' });
        }
    };

    const calculateOverdueInfo = (transaction) => {
        if (!transaction) return null;
        const today = new Date();
        const dueDate = new Date(transaction.dueDate);
        const diffTime = today - dueDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
            isOverdue: diffDays > 0,
            days: diffDays > 0 ? diffDays : 0,
            estimatedFine: diffDays > 0 ? diffDays * 10 : 0 // Assuming 10 per day as placeholder
        };
    };

    const handleReturn = async () => {
        if (!selectedTransaction) return;

        try {
            await returnBook({
                transactionId: selectedTransaction._id
            });
            setStatus({ type: 'success', message: 'Book returned successfully!' });
            setSelectedTransaction(null);
            setIssuedBooks([]);
            setSearchQuery('');
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to return book' });
        }
    };

    const overdueInfo = calculateOverdueInfo(selectedTransaction);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-black text-brand-dark tracking-tight">Return Book</h1>
                <p className="text-gray-500 font-medium font-sm uppercase tracking-widest mt-1">Lending Management</p>
            </header>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-3xl shadow-inner">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-bold" />
                    <input 
                        type="text" 
                        placeholder="Search Student Name/ID, Book Title, Accession #..." 
                        className="w-full pl-14 pr-6 py-5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all font-bold text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-8 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Issued Books Results</h3>
                    
                    <div className="space-y-3">
                        {issuedBooks.length > 0 ? (
                            issuedBooks.map(t => {
                                const info = calculateOverdueInfo(t);
                                return (
                                    <div 
                                        key={t._id}
                                        onClick={() => setSelectedTransaction(t)}
                                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-5 group ${
                                            selectedTransaction?._id === t._id 
                                            ? 'border-primary-600 bg-primary-50 shadow-md' 
                                            : 'border-white bg-white hover:border-primary-100 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className={`p-4 rounded-xl transition-colors ${selectedTransaction?._id === t._id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600'}`}>
                                            <BookIcon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-brand-dark truncate">{t.bookId?.title || 'Unknown Book'}</p>
                                                    {info.isOverdue && (
                                                        <span className="bg-rose-100 text-rose-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">Overdue</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-tighter">#{t.copyId?.accessionNumber || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center text-[10px] text-gray-500 font-bold gap-x-4 gap-y-1">
                                                <div className="flex items-center">
                                                    <User className="w-3 h-3 mr-1 text-primary-500" />
                                                    <span className="truncate">{t.studentId?.personalDetails?.fullName || 'Unknown Student'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1 text-orange-500" />
                                                    <span className={info.isOverdue ? 'text-rose-600' : ''}>Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center text-gray-300">
                                                    <Hash className="w-3 h-3 mr-1" />
                                                    <span>{t.transactionId}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : searchQuery && !loading ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">No active transactions found</p>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                                <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Search to view active issued books</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Return Summary & Action */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Return Details</h3>
                    
                    {selectedTransaction ? (
                        <div className="bg-brand-dark text-white p-8 rounded-3xl shadow-2xl flex flex-col h-fit animate-in fade-in slide-in-from-right-4">
                            <div className="mb-8 space-y-6">
                                <div>
                                    <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Confirm Return</p>
                                    <h4 className="text-xl font-black leading-tight mb-2">{selectedTransaction.bookId?.title}</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none flex items-center gap-2">
                                        <Hash className="w-3 h-3" /> {selectedTransaction.copyId?.accessionNumber}
                                    </p>
                                </div>

                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Issued To</p>
                                        <p className="font-bold text-primary-400 truncate">{selectedTransaction.studentId?.personalDetails?.fullName}</p>
                                        <p className="text-[10px] opacity-60 font-black uppercase">{selectedTransaction.studentId?.studentId}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-gray-500">Issue Date</p>
                                            <p className="text-xs font-bold">{new Date(selectedTransaction.issueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-gray-500">Due Date</p>
                                            <p className={`text-xs font-bold ${overdueInfo.isOverdue ? 'text-rose-400' : ''}`}>{new Date(selectedTransaction.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {overdueInfo.isOverdue && (
                                    <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 border-dashed space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-rose-400 font-black uppercase text-[10px] tracking-widest">
                                                <AlertCircle className="w-4 h-4" />
                                                Overdue Notice
                                            </div>
                                            <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">{overdueInfo.days} Days Delay</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-1 font-black">
                                            <p className="text-xs text-white/60">Estimated Fine</p>
                                            <p className="text-lg text-rose-400 tracking-tighter">₹{overdueInfo.estimatedFine}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleReturn}
                                disabled={loading}
                                className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 transform active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform" />
                                {loading ? 'Processing...' : 'Confirm Return'}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                             <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                                <ArrowRight className="w-8 h-8 text-gray-200" />
                             </div>
                             <p className="text-gray-400 font-bold text-sm">Select an active transaction to complete the return process</p>
                        </div>
                    )}

                    {status.message && (
                        <div className={`p-4 rounded-2xl font-bold text-xs text-center border shadow-sm animate-in fade-in slide-in-from-top-2 ${
                            status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                        }`}>
                            {status.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ArrowRight = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

export default ReturnBookPage;
