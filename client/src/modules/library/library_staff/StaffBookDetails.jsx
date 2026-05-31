import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Book as BookIcon, 
    User, 
    Calendar, 
    Layers, 
    Bookmark, 
    CheckCircle, 
    AlertCircle, 
    ArrowLeft,
    Clock,
    Hash,
    Tag,
    Globe,
    BookOpen,
    MapPin,
    ArrowUpRight,
    Loader2,
    Edit,
    Plus,
    History,
    AlertTriangle,
    Eye,
    Info
} from 'lucide-react';
import useLibrary from '../hooks/useLibrary';
import { gsap } from 'gsap';
import AcademicBookCover from '../components/AcademicBookCover';

const StaffBookDetails = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { getBook, loading: apiLoading } = useLibrary();
    
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                setLoading(true);
                const response = await getBook(bookId);
                if (response.success) {
                    setBook(response.data);
                } else {
                    setError(response.error || 'Book not found');
                }
            } catch (err) {
                console.error('Error fetching book:', err);
                setError('Failed to load book details.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookData();
    }, [bookId]);

    useEffect(() => {
        if (!loading && book) {
            gsap.fromTo(".animate-fade-up", 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, [loading, book]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-black text-brand-dark mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-500 text-center mb-6">{error || 'Book not found'}</p>
                <button type="button" 
                    onClick={() => navigate(-1)}
                    className="flex items-center px-6 py-3 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-600 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                </button>
            </div>
        );
    }

    const inventoryStats = [
        { label: 'Total Copies', value: book.stats?.total || 0, icon: Layers, color: 'text-gray-600', bg: 'bg-gray-100' },
        { label: 'Available', value: book.stats?.available || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Issued', value: book.stats?.issued || 0, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Reserved', value: book.stats?.reserved || 0, icon: Bookmark, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Damaged', value: book.stats?.damaged || 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Lost', value: book.stats?.lost || 0, icon: AlertCircle, color: 'text-red-900', bg: 'bg-red-50' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button type="button" 
                        onClick={() => navigate(-1)}
                        className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-brand-dark"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-lg font-black text-brand-dark leading-none">Inventory & Details</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Staff Management Console</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-brand-dark rounded-xl font-bold text-xs hover:bg-gray-50 transition-all">
                        <Edit className="w-4 h-4 text-blue-500" />
                        Edit Book
                    </button>
                    <button type="button" onClick={() => navigate('/app/library/issue')} className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-xl font-bold text-xs hover:bg-black transition-all">
                        <BookOpen className="w-4 h-4" />
                        Issue This Book
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Cover & Quick Stats */}
                    <div className="w-full lg:w-96 flex-shrink-0 space-y-8 animate-fade-up">
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary-500/10 group">
                            {book.coverImage ? (
                                <img 
                                    src={book.coverImage} 
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <AcademicBookCover 
                                    title={book.title}
                                    author={book.author}
                                    department={book.department}
                                    edition={book.edition}
                                    size="large" 
                                />
                            )}
                        </div>

                        {/* Inventory Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {inventoryStats.map((stat, idx) => (
                                <div key={idx} className={`${stat.bg} p-6 rounded-[2rem] border border-white/50 shadow-sm hover:shadow-md transition-all`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                                    </div>
                                    <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Detailed Info & Operations */}
                    <div className="flex-1 space-y-10 animate-fade-up">
                        {/* Title Section */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <span className="bg-primary-50 text-brand-dark text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary-100">
                                    {book.department || 'General'}
                                </span>
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-100">
                                    {book.category || 'Reference'}
                                </span>
                                <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-gray-200">
                                    {book.subject || 'N/A'}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-brand-dark leading-[1.1] tracking-tight">
                                {book.title || 'Untitled Book'}
                            </h1>
                            <div className="flex items-center text-lg font-bold text-gray-400">
                                <User className="w-5 h-5 mr-2 text-primary-500" />
                                <span>{book.author || 'Unknown Author'}</span>
                            </div>
                        </div>

                        {/* Bibliographic Details */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary-500" />
                                Bibliographic Meta
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
                                {[
                                    { icon: Globe, label: 'Publisher', value: book.publisher || 'N/A' },
                                    { icon: Tag, label: 'Edition', value: book.edition || 'N/A' },
                                    { icon: Calendar, label: 'Pub. Year', value: book.publicationYear || 'N/A' },
                                    { icon: Hash, label: 'ISBN-13', value: book.isbn || 'N/A' },
                                    { icon: Layers, label: 'Accession No.', value: book.accessionNumber || 'N/A' },
                                    { icon: Globe, label: 'Language', value: book.language || 'English' },
                                    { icon: MapPin, label: 'Shelf / Rack', value: `${book.shelfNumber || 'N/A'} / ${book.rackNumber || 'N/A'}` },
                                    { icon: Tag, label: 'Keywords', value: book.keywords?.join(', ') || 'None' },
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex items-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                            <item.icon className="w-3 h-3 mr-1.5 opacity-50" />
                                            {item.label}
                                        </div>
                                        <div className="text-sm font-black text-brand-dark">
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Operational Actions Section */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Plus className="w-4 h-4 text-primary-500" />
                                Operational Actions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <button type="button" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-black text-brand-dark mb-1">View All Copies</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Manage individual units</p>
                                </button>
                                <button type="button" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-black text-brand-dark mb-1">Add New Copies</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Expand existing stock</p>
                                </button>
                                <button type="button" onClick={() => navigate('/app/library/issue-requests')} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left">
                                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                        <History className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-black text-brand-dark mb-1">Issue Requests</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Review pending borrow tasks</p>
                                </button>
                            </div>
                        </div>

                        {/* Recent Transactions List (Mini) */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-brand-dark tracking-tight">Active Transactions</h3>
                                <button type="button" onClick={() => navigate('/app/library/issued-list')} className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:underline">View All History</button>
                            </div>
                            <div className="space-y-4">
                                {book.copies?.filter(c => c.status === 'ISSUED').length > 0 ? (
                                    book.copies.filter(c => c.status === 'ISSUED').slice(0, 5).map((copy, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600 text-xs">
                                                    #{copy.copyId?.slice(-3)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-brand-dark">Copy ID: {copy.copyId}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Status: {copy.status}</p>
                                                </div>
                                            </div>
                                            <button type="button" className="p-2 hover:bg-white rounded-xl transition-colors">
                                                <Eye className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-30">
                                        <CheckCircle className="w-10 h-10 mx-auto mb-2" />
                                        <p className="text-xs font-black uppercase tracking-widest">No active issues for this book</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {book.description && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary-500" />
                                    Book Abstract / Summary
                                </h3>
                                <p className="text-gray-500 leading-relaxed font-medium text-lg italic border-l-4 border-primary-500/20 pl-8">
                                    {book.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffBookDetails;
