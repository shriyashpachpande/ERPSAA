import React, { useEffect, useState } from 'react';
import { Search, Plus, Filter, SortAsc, MoreVertical, Edit, Trash2, Copy } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';
import BookCard from '../components/BookCard';
import gsap from 'gsap';

const StaffBookCatalog = () => {
    const { getBooks, deleteBook, loading } = useLibrary();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('title');

    const fetchBooks = async () => {
        try {
            const res = await getBooks();
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".book-grid-item", 
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    stagger: 0.05,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                    clearProps: "all"
                }
            );
        });
        return () => ctx.revert();
    }, [books]);

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             book.accessionNumber.includes(searchTerm);
        const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        return 0;
    });

    const categories = ['All', ...new Set(books.map(b => b.category).filter(Boolean))];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-black text-brand-dark tracking-tight">Book Catalog Management</h1>
                    <p className="text-gray-500 font-medium text-sm">Add, edit, or remove books from the library</p>
                </div>
                <button className="flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95 group">
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Add New Book
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by title, author, or accession number..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2">
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select 
                            className="pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div className="relative">
                        <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select 
                            className="pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="title">Sort by Title</option>
                            <option value="newest">Newest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading && books.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-gray-100 rounded"></div>
                </div>
            ) : filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredBooks.map(book => (
                        <div key={book._id} className="book-grid-item relative group">
                            <BookCard book={book} to={`/app/library/book/${book._id}`} />
                            <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-white/90 backdrop-blur shadow-md rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-white/90 backdrop-blur shadow-md rounded-lg text-primary-600 hover:bg-primary-600 hover:text-white transition-colors">
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => deleteBook(book._id).then(fetchBooks)}
                                    className="p-2 bg-white/90 backdrop-blur shadow-md rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400">No books found</h3>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default StaffBookCatalog;
