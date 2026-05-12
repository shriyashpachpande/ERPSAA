const Book = require('../../models/library-management/books.model');
const BookCopy = require('../../models/library-management/bookCopies.model');

const mongoose = require('mongoose');

exports.createBook = async (bookData) => {
    return await Book.create(bookData);
};

exports.getBooks = async (query = {}) => {
    // We use aggregation to count copies for each book
    const collectionName = BookCopy.collection.name;
    const books = await Book.aggregate([
        { $match: query },
        {
            $lookup: {
                from: 'bookcopies',
                let: { bid: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $eq: ["$bookId", "$$bid"] },
                                    { $eq: ["$bookId", { $toString: "$$bid" }] }
                                ]
                            }
                        }
                    }
                ],
                as: 'copies'
            }
        },
        {
            $addFields: {
                totalCopies: { $size: '$copies' },
                availableCopies: {
                    $size: {
                        $filter: {
                            input: '$copies',
                            as: 'copy',
                            cond: { $eq: ['$$copy.status', 'AVAILABLE'] }
                        }
                    }
                }
            }
        },
        { $sort: { createdAt: -1 } },
        { $project: { copies: 0 } }
    ]);
    return books;
};
const IssueTransaction = require('../../models/library-management/issueTransactions.model');

// ... (other exports)

exports.getBookById = async (id) => {
    // We try to find the book first
    const book = await Book.findById(id);
    if (!book) return null;

    // Aggregate copy stats using TYPE-AGNOSTIC search (handles String vs ObjectId)
    const bookObjectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    
    // We search using both ObjectId and String ID to be 100% resilient
    const copies = await BookCopy.find({ 
        bookId: { $in: [id, bookObjectId].filter(Boolean) }
    }).lean();
    
    // Explicitly compute stats with absolute type safety
    const stats = {
        total: copies.length,
        available: copies.filter(c => String(c.status).toUpperCase() === 'AVAILABLE').length,
        issued: copies.filter(c => String(c.status).toUpperCase() === 'ISSUED').length,
        reserved: copies.filter(c => String(c.status).toUpperCase() === 'RESERVED').length,
        damaged: copies.filter(c => String(c.status).toUpperCase() === 'DAMAGED').length,
        lost: copies.filter(c => String(c.status).toUpperCase() === 'LOST').length
    };

    // If all copies are issued, find the nearest expected return date
    let expectedReturnDate = null;
    if (stats.available === 0 && stats.issued > 0) {
        const nearestReturn = await IssueTransaction.findOne({ 
            bookId: bookObjectId, 
            status: 'ISSUED' 
        }).sort({ dueDate: 1 });
        
        if (nearestReturn) {
            expectedReturnDate = nearestReturn.dueDate;
        }
    }

    return {
        ...book.toObject(),
        stats,
        copies,
        expectedReturnDate
    };
};

exports.updateBook = async (id, updateData) => {
    return await Book.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteBook = async (id) => {
    // Also delete all copies of this book
    await BookCopy.deleteMany({ bookId: id });
    return await Book.findByIdAndDelete(id);
};
