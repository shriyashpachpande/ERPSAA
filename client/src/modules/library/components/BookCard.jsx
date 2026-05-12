import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Book as BookIcon, 
    User, 
    Layers, 
    CheckCircle, 
    AlertCircle, 
    Bookmark,
    ArrowUpRight
} from 'lucide-react';
import AcademicBookCover from './AcademicBookCover';

const BookCard = ({ book, to }) => {
    const detailLink = to || `/app/student/library/book/${book._id}`;
    const isAvailable = book.availableCopies > 0;
    const isLowStock = isAvailable && book.availableCopies <= 2;
    
    // Status Logic

    // Status Logic
    let statusBadge = null;
    if (isLowStock) {
        statusBadge = (
            <span className="flex items-center text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100 animate-pulse">
                <AlertCircle className="w-3 h-3 mr-1" />
                Low Stock: {book.availableCopies}
            </span>
        );
    } else if (isAvailable) {
        statusBadge = (
            <span className="flex items-center text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                Available: {book.availableCopies}
            </span>
        );
    } else if (book.totalCopies > 0) {
        statusBadge = (
            <span className="flex items-center text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                <Bookmark className="w-3 h-3 mr-1" />
                Reserved
            </span>
        );
    } else {
        statusBadge = (
            <span className="flex items-center text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                <AlertCircle className="w-3 h-3 mr-1" />
                Out of Stock
            </span>
        );
    }

    return (
        <Link 
            to={detailLink}
            className="group bg-white rounded-[2.5rem] border border-gray-100 p-4 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.5)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full border-b-4 border-b-transparent hover:border-b-primary-500 relative overflow-hidden"
        >
            {/* Hover Indicator */}
            <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/20">
                    <ArrowUpRight className="w-4 h-4 text-primary-600" />
                </div>
            </div>

            {/* Cover Area */}
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50 mb-4 group-hover:shadow-lg transition-all duration-500">
                {book.coverImage ? (
                    <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.src = ''; }} 
                    />
                ) : (
                    <AcademicBookCover 
                        title={book.title}
                        author={book.author}
                        department={book.department}
                        edition={book.edition}
                        size="medium" 
                    />
                )}
                
                {/* Floating Category */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-brand-dark text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm border border-white/20">
                    {book.category || 'General'}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-3 px-1">
                <div className="space-y-1">
                    <h3 className="text-base font-black text-brand-dark leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {book.title || 'Untitled Book'}
                    </h3>
                    <div className="flex items-center text-gray-400 font-bold text-[11px] uppercase tracking-tight">
                        <User className="w-3 h-3 mr-1" />
                        <span className="truncate">{book.author || 'Unknown Author'}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 py-2">
                    {statusBadge}
                    <span className="flex items-center text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                        <Layers className="w-3 h-3 mr-1" />
                        {book.accessionNumber || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Subtle Footer Action */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">View Details</span>
                <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-primary-500 transition-colors" />
            </div>
        </Link>
    );
};

export default React.memo(BookCard);
