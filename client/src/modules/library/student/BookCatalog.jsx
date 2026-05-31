import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, BookOpen, CheckCircle, Clock, AlertTriangle, ArrowRight, Star, Plus, Info, LayoutGrid, ListFilter, History, Bookmark, CreditCard, Book as BookIcon, Globe, Loader2 } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';
import BookCard from '../components/BookCard';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

const StudentBookCatalog = () => {
    const { getBooks, getStats, getStudentBooks, loading: libraryLoading } = useLibrary();
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [stats, setStats] = useState({ totalBooks: 0, availableCopies: 0, issuedToday: 0, overdueBooks: 0 });
    const [myBookCount, setMyBookCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [deptFilter, setDeptFilter] = useState('All');
    const [languageFilter, setLanguageFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    
    // Pagination state to prevent lag with thousands of books
    const [visibleCount, setVisibleCount] = useState(24);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [booksRes, statsRes] = await Promise.all([
                    getBooks(),
                    getStats()
                ]);
                
                setBooks(booksRes.data || []);
                setStats(statsRes.data || { totalBooks: 0, availableCopies: 0, issuedToday: 0, overdueBooks: 0 });

                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const studentRes = await fetch('/api/student-master/me', {
                            headers: { Authorization: `Bearer ${token}` }
                        }).then(r => r.json());

                        if (studentRes.success) {
                            const myBooksRes = await getStudentBooks(studentRes.data._id);
                            setMyBookCount(myBooksRes.data?.filter(b => b.status === 'ISSUED').length || 0);
                        }
                    } catch (e) {
                        console.log("Student info fetch failed");
                    }
                }
            } catch (err) {
                console.error("Initialization error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Optimized filtering and sorting using useMemo
    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesSearch = (book.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.accessionNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.isbn || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
            const matchesDept = deptFilter === 'All' || book.department === deptFilter;
            const matchesLang = languageFilter === 'All' || book.language === languageFilter;
            return matchesSearch && matchesCategory && matchesDept && matchesLang;
        }).sort((a, b) => {
            if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'AZ') return (a.title || '').localeCompare(b.title || '');
            if (sortBy === 'ZA') return (b.title || '').localeCompare(a.title || '');
            return 0;
        });
    }, [books, searchTerm, categoryFilter, deptFilter, languageFilter, sortBy]);

    // Interleave logic memoized
    const displayBooks = useMemo(() => {
        const booksToMix = filteredBooks;
        if (searchTerm !== '' || deptFilter !== 'All' || categoryFilter !== 'All') return booksToMix;
        
        if (!booksToMix.length) return [];
        const groups = {};
        booksToMix.forEach(book => {
            const dept = book.department || 'General';
            if (!groups[dept]) groups[dept] = [];
            groups[dept].push(book);
        });

        const mixed = [];
        const depts = Object.keys(groups).sort();
        let hasMore = true;
        let index = 0;

        while (hasMore) {
            hasMore = false;
            depts.forEach(dept => {
                if (groups[dept][index]) {
                    mixed.push(groups[dept][index]);
                    hasMore = true;
                }
            });
            index++;
        }
        return mixed;
    }, [filteredBooks, searchTerm, deptFilter, categoryFilter]);

    useEffect(() => {
        if (!loading) {
            const ctx = gsap.context(() => {
                // Animate only the first batch of visible items for performance
                gsap.fromTo(".reveal-anim",
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.05,
                        duration: 0.5,
                        ease: "power2.out",
                        clearProps: "all"
                    }
                );
            });
            return () => ctx.revert();
        }
    }, [loading, categoryFilter, deptFilter, sortBy]);

    const categories = useMemo(() => ['All', ...new Set(books.map(b => b.category).filter(Boolean))].sort(), [books]);
    const departments = useMemo(() => ['All', ...new Set(books.map(b => b.department).filter(Boolean))].sort(), [books]);
    const languages = useMemo(() => ['All', ...new Set(books.map(b => b.language || 'English').filter(Boolean))].sort(), [books]);

    const quickAccess = [
        { title: 'Issued Books', count: myBookCount, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', path: '/app/student/library/issued' },
        { title: 'Reservations', count: 0, icon: Bookmark, color: 'text-orange-600', bg: 'bg-orange-50', path: '/app/student/library/reservations' },
        { title: 'Fines', count: 0, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/app/student/library/fines' },
        { title: 'History', count: null, icon: History, color: 'text-purple-600', bg: 'bg-purple-50', path: '/app/student/library/history' },
    ];

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 pb-20">
            {/* 1. TOP HERO HEADER */}
            <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="flex items-center gap-6 reveal-anim">
                    <div className="p-5 bg-brand-dark rounded-[2.5rem] shadow-2xl shadow-brand-dark/20 text-white transform hover:rotate-6 transition-transform">
                        <BookIcon className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter">Digital Library</h1>
                        <p className="text-gray-400 font-bold text-lg">Explore and discover knowledge</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 reveal-anim">
                    {[
                        { label: 'Total Books', value: stats.totalBooks, icon: Star, color: 'text-amber-500' },
                        { label: 'Available', value: stats.availableCopies, icon: CheckCircle, color: 'text-emerald-500' },
                        { label: 'Issued Today', value: stats.issuedToday, icon: Clock, color: 'text-blue-500' },
                        { label: 'Overdue', value: stats.overdueBooks, icon: AlertTriangle, color: 'text-red-500' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] transition-all">
                            <div className="flex items-center gap-2 mb-1">
                                <stat.icon className={`w-3 h-3 ${stat.color}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                            </div>
                            <span className="text-2xl font-black text-brand-dark">{stat.value || '0'}</span>
                        </div>
                    ))}
                </div>
            </header>

            {/* 2. SEARCH + FILTER BAR */}
            <div className="reveal-anim flex flex-col lg:flex-row gap-4 bg-white p-3 rounded-[2.5rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)]">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search title, author, ISBN..."
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-[2rem] border-none outline-none focus:ring-2 focus:ring-primary-500/10 font-bold transition-all placeholder:text-gray-300"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setVisibleCount(24);
                        }}
                    />
                </div>
                <div className="flex flex-wrap gap-3 px-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            className="bg-transparent border-none outline-none font-black text-[10px] cursor-pointer text-gray-600 uppercase tracking-widest"
                            value={deptFilter}
                            onChange={(e) => {
                                setDeptFilter(e.target.value);
                                setVisibleCount(24);
                            }}
                        >
                            <option value="All">All Departments</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <select
                            className="bg-transparent border-none outline-none font-black text-[10px] cursor-pointer text-gray-600 uppercase tracking-widest"
                            value={languageFilter}
                            onChange={(e) => {
                                setLanguageFilter(e.target.value);
                                setVisibleCount(24);
                            }}
                        >
                            <option value="All">All Languages</option>
                            {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                        <ListFilter className="w-4 h-4 text-gray-400" />
                        <select
                            className="bg-transparent border-none outline-none font-black text-[10px] cursor-pointer text-gray-600 uppercase tracking-widest"
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setVisibleCount(24);
                            }}
                        >
                            <option value="Newest">Newest First</option>
                            <option value="Oldest">Oldest First</option>
                            <option value="AZ">A - Z Title</option>
                            <option value="ZA">Z - A Title</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 3. CATEGORY PILLS */}
            <div className="reveal-anim flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {categories.map(cat => (
                    <button type="button"
                        key={cat}
                        onClick={() => {
                            setCategoryFilter(cat);
                            setVisibleCount(24);
                        }}
                        className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${categoryFilter === cat
                            ? 'bg-brand-dark text-white border-brand-dark shadow-lg shadow-brand-dark/20'
                            : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                {/* 4. MAIN BOOKS GRID */}
                <div className="xl:col-span-3 space-y-10">
                    <div className="flex items-center justify-between reveal-anim bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="w-6 h-6 text-primary-500" />
                            <h2 className="text-2xl font-black text-brand-dark">Featured Collection</h2>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            {filteredBooks.length} Books Found
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Synchronizing Catalog...</p>
                        </div>
                    ) : filteredBooks.length > 0 ? (
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayBooks.slice(0, visibleCount).map(book => (
                                    <div key={book._id} className="reveal-anim">
                                        <BookCard
                                            book={book}
                                            onIssue={(b) => navigate(`/app/student/library/catalog/${b._id}`)}
                                            onReserve={(b) => navigate(`/app/student/library/catalog/${b._id}`)}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {visibleCount < displayBooks.length && (
                                <div className="flex justify-center pt-8">
                                    <button type="button" 
                                        onClick={() => setVisibleCount(prev => prev + 24)}
                                        className="px-10 py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]"
                                    >
                                        Load More Books
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-24 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 shadow-inner">
                            <div className="p-6 bg-white rounded-full w-fit mx-auto mb-6 shadow-sm">
                                <Search className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-2xl font-black text-brand-dark mb-2">No matching records found</h3>
                            <p className="text-gray-400 font-bold max-w-sm mx-auto text-sm leading-relaxed">
                                We couldn't find any books matching your criteria. Try adjusting your search or filters.
                            </p>
                            <button type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setCategoryFilter('All');
                                    setDeptFilter('All');
                                    setLanguageFilter('All');
                                }}
                                className="mt-8 px-8 py-3 bg-brand-dark text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}

                    {/* 5. QUICK ACCESS SECTION */}
                    <div className="pt-12 space-y-8">
                        <div className="flex items-center gap-3 reveal-anim">
                            <LayoutGrid className="w-6 h-6 text-primary-500" />
                            <h2 className="text-2xl font-black text-brand-dark">Library Services</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickAccess.map((item) => (
                                <div
                                    key={item.title}
                                    onClick={() => navigate(item.path)}
                                    className="reveal-anim bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] hover:-translate-y-2 transition-all cursor-pointer group"
                                >
                                    <div className={`p-4 ${item.bg} ${item.color} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-black text-brand-dark">{item.title}</h4>
                                        {item.count !== null && (
                                            <span className="text-[10px] font-black bg-brand-dark text-white px-2 py-1 rounded-lg">
                                                {item.count}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center group-hover:text-primary-600 transition-colors">
                                        View details <ArrowRight className="w-3 h-3 ml-2" />
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 6 & 7. SIDEBAR PANELS */}
                <aside className="space-y-10">
                    {/* Recently Added Section */}
                    <section className="reveal-anim bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-brand-dark">Recently Added</h3>
                            <Plus className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="space-y-6">
                            {books.slice(0, 4).map(book => (
                                <div key={book._id} className="flex gap-4 group cursor-pointer" onClick={() => navigate(`/app/student/library/catalog/${book._id}`)}>
                                    <div className="w-16 h-20 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                                        {book.coverImage ? (
                                            <img src={book.coverImage} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <BookIcon className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h5 className="text-xs font-black text-brand-dark line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
                                            {book.title}
                                        </h5>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter truncate">by {book.author}</p>
                                        <span className="inline-block text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">NEW</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Announcement Panel */}
                    <section className="reveal-anim bg-brand-dark p-8 rounded-[2.5rem] text-white shadow-2xl shadow-brand-dark/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <Info className="w-6 h-6 text-primary-400" />
                                <h3 className="text-xl font-black tracking-tight uppercase">Announcements</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: 'New Semester Arrivals', date: 'Oct 15', text: '500+ new engineering journals added' },
                                    { title: 'Extended Hours', date: 'Oct 12', text: 'Library now open until 10 PM' },
                                ].map((idx) => (
                                    <div key={idx.title} className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                        <div className="flex items-center justify-between mb-1">
                                            <h6 className="text-[9px] font-black text-primary-400 uppercase tracking-widest">{idx.date}</h6>
                                        </div>
                                        <h5 className="text-sm font-black mb-1">{idx.title}</h5>
                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{idx.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default StudentBookCatalog;
