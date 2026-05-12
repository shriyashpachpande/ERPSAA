const IssueTransaction = require('../../models/library-management/issueTransactions.model');
const Book = require('../../models/library-management/books.model');
const BookCopy = require('../../models/library-management/bookCopies.model');
const IssueRequest = require('../../models/library-management/issueRequests.model');

exports.getLibraryStats = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const availableCopies = await BookCopy.countDocuments({ status: 'AVAILABLE' });
        const pendingRequests = await IssueRequest.countDocuments({ status: 'PENDING' });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const issuedToday = await IssueTransaction.countDocuments({
            issueDate: { $gte: today },
            status: 'ISSUED'
        });

        const returnedToday = await IssueTransaction.countDocuments({
            returnDate: { $gte: today },
            status: 'RETURNED'
        });

        const overdueBooksCount = await IssueTransaction.countDocuments({
            status: 'OVERDUE'
        });

        // 1. Monthly Issue Activity (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const monthlyActivity = await IssueTransaction.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            { $group: {
                _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                issued: { $sum: { $cond: [{ $ne: ["$status", "RETURNED"] }, 1, 0] } },
                returned: { $sum: { $cond: [{ $eq: ["$status", "RETURNED"] }, 1, 0] } }
            }},
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format monthlyActivity for Recharts
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedMonthlyData = monthlyActivity.map(item => ({
            name: monthNames[item._id.month - 1],
            issued: item.issued,
            returned: item.returned
        }));

        // 2. Category Distribution
        const categoryDistribution = await Book.aggregate([
            { $group: { _id: "$category", value: { $sum: 1 } } },
            { $project: { name: "$_id", value: 1, _id: 0 } },
            { $sort: { value: -1 } },
            { $limit: 6 }
        ]);

        // 3. Recent Issue Requests
        const recentRequests = await IssueRequest.find({ status: 'PENDING' })
            .populate('studentId', 'personalDetails.fullName studentId')
            .populate('bookId', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        // 4. Recent Transactions
        const recentTransactions = await IssueTransaction.find()
            .populate('studentId', 'personalDetails.fullName')
            .populate('bookId', 'title')
            .populate('copyId', 'accessionNumber')
            .sort({ updatedAt: -1 })
            .limit(5);

        // 5. Operational Alerts
        const lowStockBooks = await Book.find({ availableCopies: { $lte: 2 } }).limit(3);
        const damagedCopies = await BookCopy.countDocuments({ status: 'DAMAGED' });

        res.status(200).json({
            success: true,
            data: {
                totalBooks,
                availableCopies,
                pendingRequests,
                issuedToday,
                returnedToday,
                overdueBooks: overdueBooksCount,
                monthlyActivity: formattedMonthlyData,
                categoryDistribution,
                recentRequests,
                recentTransactions,
                alerts: {
                    overdue: overdueBooksCount,
                    lowStock: lowStockBooks.length,
                    damaged: damagedCopies
                }
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
