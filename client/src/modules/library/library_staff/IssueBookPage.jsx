import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, User, Book as BookIcon, CheckCircle, AlertCircle, Calendar, ArrowRight, Link } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';
import { getAllStudents } from '../../student-master/services/studentMasterService';
import gsap from 'gsap';

const IssueBookPage = () => {
    const location = useLocation();
    const { getBooks, getCopies, issueBook, loading: libraryLoading } = useLibrary();
    const [students, setStudents] = useState([]);
    const [books, setBooks] = useState([]);
    const [copies, setCopies] = useState([]);
    
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedCopy, setSelectedCopy] = useState(null);
    
    const [studentSearch, setStudentSearch] = useState('');
    const [bookSearch, setBookSearch] = useState('');
    
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleBookSelect = async (book) => {
        setSelectedBook(book);
        setSelectedCopy(null);
        try {
            const res = await getCopies(book._id);
            setCopies(res.data.filter(c => c.status === 'AVAILABLE'));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const studentRes = await getAllStudents();
                const fetchedStudents = studentRes.data;
                setStudents(fetchedStudents);
                
                const bookRes = await getBooks();
                const fetchedBooks = bookRes.data;
                setBooks(fetchedBooks);

                // Handle Prefilled Data from State
                if (location.state?.prefilledStudent && location.state?.prefilledBook) {
                    const student = fetchedStudents.find(s => s._id === location.state.prefilledStudent._id);
                    const book = fetchedBooks.find(b => b._id === location.state.prefilledBook._id);
                    
                    if (student) {
                        setSelectedStudent(student);
                        setStudentSearch(student.personalDetails.fullName);
                    }
                    if (book) {
                        handleBookSelect(book);
                        setBookSearch(book.title);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchInitialData();
    }, [location.state]);

    const filteredStudents = students.filter(s => 
        s.personalDetails.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || 
        s.studentId.toLowerCase().includes(studentSearch.toLowerCase())
    ).slice(0, 5);

    const filteredBooks = books.filter(b => 
        b.title.toLowerCase().includes(bookSearch.toLowerCase()) || 
        b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
        b.accessionNumber.includes(bookSearch)
    ).slice(0, 5);



    const handleIssue = async () => {
        if (!selectedStudent || !selectedBook || !selectedCopy) {
            setStatus({ type: 'error', message: 'Please select student, book, and copy' });
            return;
        }

        try {
            await issueBook({
                studentId: selectedStudent._id,
                bookId: selectedBook._id,
                copyId: selectedCopy._id
            });
            setStatus({ type: 'success', message: 'Book issued successfully!' });
            // Reset
            setSelectedStudent(null);
            setSelectedBook(null);
            setSelectedCopy(null);
            setStudentSearch('');
            setBookSearch('');
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to issue book' });
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark tracking-tight">Issue Book</h1>
                    <p className="text-gray-500 font-medium font-sm uppercase tracking-widest mt-1">Lending Management</p>
                </div>
                {location.state?.prefilledRequestId && (
                    <div className="bg-primary-50 text-primary-700 px-6 py-3 rounded-2xl border border-primary-100 flex items-center gap-3 animate-in slide-in-from-right-4">
                        <Link className="w-5 h-5" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">Linked to Request</p>
                            <p className="font-bold text-sm tracking-tighter">REQ-{location.state.prefilledRequestId.substring(18)}</p>
                        </div>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Student Selection */}
                <div className="space-y-4">
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">1. Select Student</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by ID or Name..." 
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all font-bold"
                            value={studentSearch}
                            onChange={(e) => {
                                setStudentSearch(e.target.value);
                                if (selectedStudent) setSelectedStudent(null);
                            }}
                        />
                        {studentSearch && !selectedStudent && (
                            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-gray-50 animate-in fade-in slide-in-from-top-2">
                                {filteredStudents.map(s => (
                                    <div 
                                        key={s._id} 
                                        className="p-4 hover:bg-primary-50 cursor-pointer flex items-center transition-colors"
                                        onClick={() => {
                                            setSelectedStudent(s);
                                            setStudentSearch(s.personalDetails.fullName);
                                        }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-3 uppercase">
                                            {s.personalDetails.fullName.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{s.personalDetails.fullName}</p>
                                            <p className="text-xs text-primary-600 font-black tracking-tighter">{s.studentId}</p>
                                        </div>
                                    </div>
                                ))}
                                {filteredStudents.length === 0 && <div className="p-4 text-center text-gray-400 font-bold">No students found</div>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Book Selection */}
                <div className="space-y-4">
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest">2. Select Book</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search Title, Author, or Accession..." 
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all font-bold"
                            value={bookSearch}
                            onChange={(e) => {
                                setBookSearch(e.target.value);
                                if (selectedBook) {
                                    setSelectedBook(null);
                                    setCopies([]);
                                    setSelectedCopy(null);
                                }
                            }}
                        />
                        {bookSearch && !selectedBook && (
                            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-gray-50 animate-in fade-in slide-in-from-top-2">
                                {filteredBooks.map(b => (
                                    <div 
                                        key={b._id} 
                                        className="p-4 hover:bg-primary-50 cursor-pointer flex items-center transition-colors"
                                        onClick={() => {
                                            handleBookSelect(b);
                                            setBookSearch(b.title);
                                        }}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 mr-3">
                                            <BookIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{b.title}</p>
                                            <p className="text-xs text-gray-500">{b.author} | Acc: {b.accessionNumber}</p>
                                        </div>
                                    </div>
                                ))}
                                {filteredBooks.length === 0 && <div className="p-4 text-center text-gray-400 font-bold">No books found</div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Selection Summary & Copy Selection */}
            {selectedBook && (
                <div className="glass-panel p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                         <h3 className="text-xl font-black text-brand-dark">3. Choose Available Copy</h3>
                         {selectedCopy && (
                            <span className="bg-emerald-50 text-emerald-700 text-xs font-black px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1.5" /> Selected Copy #{selectedCopy.copyNumber}
                            </span>
                         )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {libraryLoading && copies.length === 0 ? (
                            <div className="col-span-full py-10 text-center text-gray-400 font-bold animate-pulse uppercase tracking-widest">
                                Checking copy availability...
                            </div>
                        ) : copies.length > 0 ? (
                            copies.map(copy => (
                                <button
                                    key={copy._id}
                                    onClick={() => setSelectedCopy(copy)}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group ${
                                        selectedCopy?._id === copy._id 
                                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md' 
                                        : 'border-gray-100 bg-white text-gray-500 hover:border-primary-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Copy No.</span>
                                    <span className="text-2xl font-black">{copy.copyNumber}</span>
                                    <div className="text-[9px] font-bold bg-white/60 px-2 py-0.5 rounded-md border border-gray-100">
                                        {copy.shelfNumber || 'N/A'}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="col-span-full py-10 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
                                <AlertCircle className="w-8 h-8 mb-2" />
                                <p className="font-bold">No copies of this book are currently available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Action Section */}
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-dark text-white p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/5">
                        <Calendar className="w-8 h-8 text-primary-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Issue Overview</p>
                        <div className="flex items-center text-lg font-bold gap-3">
                             <span className="opacity-60">Today</span>
                             <ArrowRight className="w-4 h-4 text-primary-400" />
                             <span>Due: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <button 
                    disabled={!selectedStudent || !selectedBook || !selectedCopy || libraryLoading}
                    onClick={handleIssue}
                    className="w-full md:w-auto px-10 py-5 bg-primary-600 text-white rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center"
                >
                    {libraryLoading ? 'Processing...' : 'Confirm Issue'}
                </button>
            </div>

            {status.message && (
                <div className={`p-5 rounded-2xl flex items-center justify-center font-bold text-sm tracking-wide shadow-lg border-2 animate-in fade-in zoom-in slide-in-from-bottom-5 duration-300 ${
                    status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default IssueBookPage;
