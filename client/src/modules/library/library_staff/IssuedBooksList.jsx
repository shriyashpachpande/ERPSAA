import React, { useEffect, useState } from 'react';
import { Book as BookIcon, User, Clock, AlertTriangle, Search, Filter } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';

const IssuedBooksList = () => {
    const { getIssuedBooks, loading } = useLibrary();
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchIssued = async () => {
            try {
                const res = await getIssuedBooks();
                setTransactions(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchIssued();
    }, []);

    const filtered = transactions.filter(t => 
        t.bookId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.studentId.personalDetails.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.studentId.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && transactions.length === 0) {
        return <div className="p-10 text-center animate-pulse font-bold text-gray-400">Loading issued books...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark tracking-tight">Issued Books</h1>
                    <p className="text-gray-500 font-medium">Currently borrowed items across the institution</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search student, book, or ID..." 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Book Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Issued To</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dates</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(t => (
                                <tr key={t._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                <BookIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-dark leading-tight">{t.bookId.title}</p>
                                                <p className="text-[10px] font-black text-primary-600 uppercase tracking-tighter">Acc: {t.bookId.accessionNumber} | Copy: #{t.copyId.copyNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-700 uppercase">
                                                {t.studentId.personalDetails.fullName.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm leading-tight">{t.studentId.personalDetails.fullName}</p>
                                                <p className="text-[10px] text-gray-400 font-bold tracking-widest">{t.studentId.studentId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-[10px] font-bold text-gray-400">
                                                <Clock className="w-3 h-3 mr-1.5" />
                                                <span>Issued: {new Date(t.issueDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center text-[10px] font-black text-orange-600">
                                                <AlertTriangle className="w-3 h-3 mr-1.5" />
                                                <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            t.status === 'OVERDUE' 
                                            ? 'bg-red-50 text-red-600 border-red-100' 
                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                                        No active library issues found matching your search
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IssuedBooksList;
