const mongoose = require('mongoose');
const policyService = require('./policy.service');
const fineService = require('./fine.service');
const reservationService = require('./reservation.service');
const Fine = require('../../models/library-management/fines.model');
const Reservation = require('../../models/library-management/reservations.model');
const IssueTransaction = require('../../models/library-management/issueTransactions.model');
const BookCopy = require('../../models/library-management/bookCopies.model');
const Book = require('../../models/library-management/books.model');
const StudentMaster = require('../../models/student-master/StudentMaster');
const User = require('../../models/auth/User');

exports.issueBook = async (issueData) => {
    const { studentId, bookId, copyId, userId } = issueData;

    // Support both String and ObjectId for matching (Type-Agnostic)
    const bookObjectId = mongoose.Types.ObjectId.isValid(bookId) ? new mongoose.Types.ObjectId(bookId) : null;
    const bookIds = [bookId, bookObjectId].filter(id => id !== null);

    // 1. Validate student exists in Central Student Database
    const student = await StudentMaster.findById(studentId);
    if (!student) {
        throw new Error('Student not found in Central Student Database');
    }

    const policy = await policyService.getActivePolicy();
    const issuedBooksCount = await IssueTransaction.countDocuments({
        studentId,
        status: { $in: ['ISSUED', 'OVERDUE'] }
    });

    if (issuedBooksCount >= policy.studentMaxIssueLimit) {
        throw new Error(`Student has reached the maximum limit of ${policy.studentMaxIssueLimit} issued books`);
    }

    // 2.5 Check for outstanding fines above threshold
    const unpaidFines = await Fine.find({ studentId, status: { $in: ['UNPAID', 'PARTIAL'] } });
    const totalFineAmount = unpaidFines.reduce((sum, f) => sum + f.remainingAmount, 0);
    
    if (totalFineAmount > policy.fineThresholdForIssueBlock) {
        throw new Error(`Student has outstanding library fines (₹${totalFineAmount}) exceeding the threshold of ₹${policy.fineThresholdForIssueBlock}. Please clear fines first.`);
    }

    // 3. Check copy availability
    const copy = await BookCopy.findById(copyId);
    if (!copy || copy.status !== 'AVAILABLE') {
        throw new Error('Selected book copy is not available for issue');
    }

    // 4. Create transaction
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + policy.standardIssueDays);

    const transaction = await IssueTransaction.create({
        transactionId: `TXN-${Date.now()}`,
        studentId,
        bookId: bookObjectId || bookId,
        copyId,
        dueDate,
        issuedBy: userId,
        status: 'ISSUED'
    });

    // 5. Update copy status
    await BookCopy.findByIdAndUpdate(copyId, { status: 'ISSUED' });

    // 6. Check if this student had a reservation for this book (Type-Agnostic)
    const reservation = await Reservation.findOne({
        studentId,
        bookId: { $in: bookIds },
        status: { $in: ['ACTIVE', 'NOTIFIED'] }
    });
    
    if (reservation) {
        await reservationService.fulfillReservation(reservation._id);
    }

    return transaction;
};

exports.returnBook = async (returnData) => {
    const { transactionId, userId } = returnData;

    const transaction = await IssueTransaction.findById(transactionId);
    if (!transaction || transaction.status === 'RETURNED') {
        throw new Error('Valid transaction not found or book already returned');
    }

    // Update transaction
    transaction.returnDate = new Date();
    transaction.status = 'RETURNED';
    transaction.returnedBy = userId;
    await transaction.save();

    // Update copy status
    await BookCopy.findByIdAndUpdate(transaction.copyId, { status: 'AVAILABLE' });

    // Calculate and trigger fine if overdue
    const fineAmount = await fineService.calculateOverdueFine(transaction);
    if (fineAmount > 0) {
        await fineService.createFine({
            transactionId: transaction._id,
            studentId: transaction.studentId,
            bookId: transaction.bookId,
            copyId: transaction.copyId,
            fineType: 'OVERDUE',
            amount: fineAmount,
            remainingAmount: fineAmount,
            notes: `Auto-generated fine for ${Math.ceil(Math.abs(transaction.returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24))} days overdue.`
        });
    }

    // Phase 2.2: Check for next reservation in queue
    await reservationService.notifyNextInQueue(transaction.bookId);

    return transaction;
};

exports.getStudentIssuedBooks = async (studentId) => {
    return await IssueTransaction.find({ studentId }).populate('bookId').populate('copyId');
};

exports.getIssuedBooks = async (searchQuery = '') => {
    let filter = { status: { $in: ['ISSUED', 'OVERDUE'] } };

    if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i');
        
        // 1. Search across multiple collections
        const [matchingStudents, matchingBooks, matchingCopies] = await Promise.all([
            StudentMaster.find({
                $or: [
                    { studentId: regex },
                    { 'personalDetails.fullName': regex }
                ]
            }).select('_id'),
            Book.find({ title: regex }).select('_id'),
            BookCopy.find({ accessionNumber: regex }).select('_id')
        ]);

        const studentIds = matchingStudents.map(s => s._id);
        const bookIds = matchingBooks.map(b => b._id);
        const copyIds = matchingCopies.map(c => c._id);

        filter.$and = [
            { status: { $in: ['ISSUED', 'OVERDUE'] } },
            {
                $or: [
                    { transactionId: regex },
                    { studentId: { $in: studentIds } },
                    { bookId: { $in: bookIds } },
                    { copyId: { $in: copyIds } }
                ]
            }
        ];
    }

    return await IssueTransaction.find(filter)
        .populate('bookId')
        .populate('studentId')
        .populate('copyId')
        .sort({ issueDate: -1 });
};

// Keep for backward compatibility if needed elsewhere, but updated to use new logic
exports.getAllIssuedBooks = async () => {
    return await exports.getIssuedBooks();
};
