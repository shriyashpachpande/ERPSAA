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
    Loader2
} from 'lucide-react';
import useLibrary from '../hooks/useLibrary';
import { gsap } from 'gsap';
import AcademicBookCover from '../components/AcademicBookCover';

const BookDetails = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { getBook, createIssueRequest, createReservation, loading: apiLoading } = useLibrary();

    const [book, setBook] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionStatus, setActionStatus] = useState({ loading: false, message: '', type: '' });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // Fetch Book
                const response = await getBook(bookId);
                if (response.success) {
                    setBook(response.data);
                }

                // Fetch Student
                const studentRes = await fetch('/api/student-master/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }).then(r => r.json());

                if (studentRes.success) {
                    setStudent(studentRes.data);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load book or student details.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [bookId]);

    const handleIssue = async () => {
        if (!student) return alert("Student information not found. Please log in again.");
        try {
            setActionStatus({ loading: true, message: 'Submitting your borrow request...', type: 'info' });

            // For a request, we can still suggest the first available copy if we want, 
            // but the librarian ultimately decides.
            const availableCopy = book.copies?.find(c => c.status === 'AVAILABLE');

            const res = await createIssueRequest({
                studentId: student._id,
                bookId: book._id,
                copyId: availableCopy?._id // Suggested copy
            });

            if (res.success) {
                setActionStatus({
                    loading: false,
                    message: 'Borrow request submitted! A librarian will review it shortly.',
                    type: 'success'
                });
                // Optional: Refresh book data (though request doesn't change inventory immediately)
                const updatedBook = await getBook(bookId);
                setBook(updatedBook.data);
            }
        } catch (err) {
            setActionStatus({ loading: false, message: err.response?.data?.error || 'Failed to submit request.', type: 'error' });
        } finally {
            setActionStatus(prev => ({ ...prev, loading: false }));
        }
    };

    const handleReserve = async () => {
        if (!student) return alert("Student information not found.");
        try {
            // STEP 1: LOG THE EXACT REQUEST PAYLOAD
            console.log("--- FRONTEND RESERVATION DEBUG ---");
            console.log("studentId:", student._id);
            console.log("bookId:", book._id);
            console.log("Computed Inventory in UI:", book.stats);
            console.log("Full Book Object:", book);
            console.log("Action determined by availableCopies:", book.stats?.available);
            console.log("----------------------------------");

            setActionStatus({ loading: true, message: 'Placing your reservation...', type: 'info' });
            const res = await createReservation({
                studentId: student._id,
                bookId: book._id,
                reservationDate: new Date()
            });

            if (res.success) {
                setActionStatus({ loading: false, message: 'Reservation placed successfully! We will notify you when available.', type: 'success' });
                // Refresh book data to reflect latest reservation counts
                const updatedBook = await getBook(bookId);
                if (updatedBook.success) setBook(updatedBook.data);
            }
        } catch (err) {
            setActionStatus({ loading: false, message: err.response?.data?.error || 'Failed to place reservation.', type: 'error' });
        } finally {
            setActionStatus(prev => ({ ...prev, loading: false }));
        }
    };

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
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-black text-brand-dark mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-500 text-center mb-6">{error || 'Book not found'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center px-6 py-3 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-600 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                </button>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-brand-dark"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h2 className="text-lg font-black text-brand-dark leading-none">Book Details</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Institutional Catalog</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
                {/* Action Feedback Toast */}
                {actionStatus.message && (
                    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl border animate-fade-up ${actionStatus.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' :
                            actionStatus.type === 'error' ? 'bg-rose-600 border-rose-500 text-white' :
                                'bg-blue-600 border-blue-500 text-white'
                        }`}>
                        {actionStatus.loading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                            actionStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-bold text-sm tracking-wide">{actionStatus.message}</span>
                        {!actionStatus.loading && (
                            <button onClick={() => setActionStatus({ ...actionStatus, message: '' })} className="ml-4 opacity-70 hover:opacity-100 font-black">✕</button>
                        )}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Premium Cover */}
                    {/* ... (rest of the cover code remains same) */}
                    <div className="w-full lg:w-96 flex-shrink-0 animate-fade-up">
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] group">
                            {book.coverImage ? (
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
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
                    </div>

                    {/* Right Column: Information */}
                    <div className="flex-1 space-y-10 animate-fade-up">
                        {/* Title Section */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <span className="bg-primary-50 text-brand-dark text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary-100">
                                    {book.department || 'General'}
                                </span>
                                <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-gray-200">
                                    {book.category || 'Reference'}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-brand-dark leading-[1.1] tracking-tight">
                                {book.title || 'Untitled Book'}
                            </h1>
                            {book.subtitle && (
                                <p className="text-xl font-bold text-gray-400 italic">
                                    {book.subtitle}
                                </p>
                            )}
                            <div className="flex items-center text-lg font-bold text-gray-500">
                                <User className="w-5 h-5 mr-2 text-primary-500" />
                                <span>{book.author || 'Unknown Author'}</span>
                            </div>
                        </div>

                        {/* Meta Data Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { icon: Globe, label: 'Publisher', value: book.publisher || 'N/A' },
                                { icon: Tag, label: 'Edition', value: book.edition || 'N/A' },
                                { icon: Calendar, label: 'Year', value: book.publicationYear || 'N/A' },
                                { icon: Hash, label: 'ISBN', value: book.isbn || 'N/A' },
                                { icon: Layers, label: 'Accession', value: book.accessionNumber || 'N/A' },
                                { icon: BookOpen, label: 'Subject', value: book.subject || 'N/A' },
                                { icon: MapPin, label: 'Shelf', value: `${book.shelfNumber || 'N/A'} / ${book.rackNumber || 'N/A'}` },
                                { icon: Globe, label: 'Language', value: book.language || 'English' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all">
                                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                        <item.icon className="w-3 h-3 mr-1.5 text-primary-400" />
                                        {item.label}
                                    </div>
                                    <div className="text-sm font-black text-brand-dark truncate">
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Inventory Panel */}
                        <div className="bg-brand-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="flex-1 space-y-6 w-full">
                                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                        <Bookmark className="w-6 h-6 text-primary-400" />
                                        Library Inventory
                                    </h3>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest opacity-60">Total Copies</div>
                                            <div className="text-2xl font-black">{book.stats?.total || 0}</div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest opacity-60">Available</div>
                                            <div className="text-2xl font-black">{book.stats?.available || 0}</div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest opacity-60">Issued</div>
                                            <div className="text-2xl font-black">{book.stats?.issued || 0}</div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest opacity-60">Reserved</div>
                                            <div className="text-2xl font-black">{book.stats?.reserved || 0}</div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest opacity-60">Damaged</div>
                                            <div className="text-2xl font-black">{book.stats?.damaged || 0}</div>
                                        </div>
                                    </div>

                                    {book.stats?.available === 0 && book.expectedReturnDate && (
                                        <div className="flex items-center gap-3 bg-amber-500/20 border border-amber-500/30 p-4 rounded-2xl">
                                            <Clock className="w-5 h-5 text-amber-400" />
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">Expected Soon</div>
                                                <div className="text-sm font-bold text-amber-100">
                                                    Next copy available by {new Date(book.expectedReturnDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full md:w-auto flex flex-col gap-4">
                                    {book.stats?.available > 0 ? (
                                        <button
                                            onClick={handleIssue}
                                            disabled={actionStatus.loading}
                                            className="w-full md:w-64 bg-primary-500 hover:bg-primary-600 text-white font-black uppercase tracking-[0.2em] py-5 rounded-[1.5rem] shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
                                        >
                                            {actionStatus.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Issue'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleReserve}
                                            disabled={actionStatus.loading}
                                            className="w-full md:w-64 bg-white/10 hover:bg-white/20 border-2 border-white/10 text-white font-black uppercase tracking-[0.2em] py-5 rounded-[1.5rem] active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
                                        >
                                            {actionStatus.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Place Reservation'}
                                        </button>
                                    )}
                                    <p className="text-[9px] text-center text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                                        Subject to professional library ethics & policy
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {book.description && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary-500" />
                                    Abstract
                                </h3>
                                <p className="text-gray-500 leading-relaxed font-medium text-lg italic border-l-4 border-primary-500/20 pl-6">
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

export default BookDetails;
