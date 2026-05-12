const IssueTransaction = require('../../models/library-management/issueTransactions.model');
const Book = require('../../models/library-management/books.model');
const Fine = require('../../models/library-management/fines.model');
const Reservation = require('../../models/library-management/reservations.model');
const mongoose = require('mongoose');

const getAdvancedAnalytics = async () => {
    // 1. Circulation Trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const circulationTrend = await IssueTransaction.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            issues: { $sum: 1 },
            returns: { $sum: { $cond: [{ $eq: ["$status", "RETURNED"] }, 1, 0] } }
        }},
        { $sort: { "_id": 1 } }
    ]);

    // 2. Most Popular Books
    const popularBooks = await IssueTransaction.aggregate([
        { $group: { _id: "$bookId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
        { $unwind: '$book' }
    ]);

    // 3. Fine Collection Summary
    const fineStats = await Fine.aggregate([
        { $group: {
            _id: "$status",
            totalAmount: { $sum: "$amount" },
            remainingAmount: { $sum: "$remainingAmount" },
            count: { $sum: 1 }
        }}
    ]);

    // 4. Inventory Health
    const inventoryStats = await Book.aggregate([
        { $group: {
            _id: null,
            totalBooks: { $sum: 1 },
            totalCopies: { $sum: "$totalCopies" },
            availableCopies: { $sum: "$availableCopies" }
        }}
    ]);

    return {
        circulationTrend,
        popularBooks,
        fineStats,
        inventoryStats: inventoryStats[0] || {}
    };
};

module.exports = {
    getAdvancedAnalytics
};
