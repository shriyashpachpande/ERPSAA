import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Book as BookIcon, Calendar, Clock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';
import gsap from 'gsap';

const MyIssuedBooks = () => {
    const { getStudentBooks } = useLibrary();
    const [issued, setIssued] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const fetchMyBooks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const studentRes = await fetch(`/api/student-master/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.json());

                if (isMounted && studentRes.success) {
                    const res = await getStudentBooks(studentRes.data._id);
                    if (res.success) {
                        setIssued(res.data.filter(t => t.status !== 'RETURNED'));
                    }
                }
            } catch (err) {
                console.error("Library fetch error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchMyBooks();
        return () => { isMounted = false; };
    }, []);

    useLayoutEffect(() => {
        if (!loading && containerRef.current) {
            const ctx = gsap.context(() => {
                const items = containerRef.current.querySelectorAll('.stagger-item');
                if (items.length > 0) {
                    gsap.fromTo(items,
                        { x: 50, opacity: 0 },
                        {
                            x: 0,
                            opacity: 1,
                            duration: 0.8,
                            stagger: 0.1,
                            ease: "power3.out",
                            clearProps: "all"
                        }
                    );
                }
            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading]);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Library Records...</p>
        </div>
    );

    return (
        <div ref={containerRef} className="p-6 max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 stagger-item">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark tracking-tight">My Issued Books</h1>
                    <p className="text-gray-500 font-medium text-sm">Review your borrowed items and due dates</p>
                </div>
                <div className="bg-blue-50 px-6 py-3 rounded-2xl flex items-center gap-3 border border-blue-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 font-black text-sm uppercase tracking-wider">Quota: {issued.length} / 3 Books</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {issued.length > 0 ? (
                    issued.map(t => (
                        <div key={t._id} className="stagger-item bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col relative overflow-hidden group shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <BookIcon className="w-32 h-32 rotate-12" />
                            </div>

                            <div className="mb-6">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border ${t.status === 'OVERDUE' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                    }`}>
                                    {t.status}
                                </span>
                                <h3 className="text-xl font-black text-brand-dark leading-tight line-clamp-2">{t.bookId?.title || 'Unknown Title'}</h3>
                                <p className="text-gray-500 font-medium text-sm mt-1">by {t.bookId?.author || 'Unknown Author'}</p>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Issued On</span>
                                        <span className="font-bold text-gray-900 text-sm">{new Date(t.issueDate).toLocaleDateString()}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300" />
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] font-black uppercase text-orange-400 tracking-widest">Due Date</span>
                                        <span className="font-bold text-orange-600 text-sm">{new Date(t.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Accession: {t.bookId?.accessionNumber || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="stagger-item col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-[3rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
                            <BookIcon className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">No books currently issued</h3>
                        <p className="text-gray-400 max-w-xs mt-2 text-sm font-medium">Visit the library catalog to find resources for your studies.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyIssuedBooks;
