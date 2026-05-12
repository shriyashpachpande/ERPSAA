const BookCopy = require('../../models/library-management/bookCopies.model');
const fineService = require('./fine.service');

exports.createCopy = async (copyData) => {
    return await BookCopy.create(copyData);
};

exports.getCopiesByBookId = async (bookId) => {
    return await BookCopy.find({ bookId });
};

exports.updateCopyStatus = async (copyId, status) => {
    return await BookCopy.findByIdAndUpdate(copyId, { status }, { new: true });
};

exports.markAsLost = async (copyId, userId, studentId, notes) => {
    const copy = await BookCopy.findById(copyId);
    if (!copy) throw new Error('Book copy not found');

    copy.status = 'LOST';
    await copy.save();

    // Trigger Fine
    if (studentId) {
        await fineService.createFine({
            studentId,
            bookId: copy.bookId,
            copyId: copy._id,
            fineType: 'LOST',
            amount: 500, // Placeholder
            remainingAmount: 500,
            notes: `Book marked as LOST. ${notes}`
        });
    }

    return copy;
};

exports.markAsDamaged = async (copyId, userId, studentId, amount, notes) => {
    const copy = await BookCopy.findById(copyId);
    if (!copy) throw new Error('Book copy not found');

    copy.status = 'DAMAGED';
    await copy.save();

    // Trigger Fine
    if (studentId && amount > 0) {
        await fineService.createFine({
            studentId,
            bookId: copy.bookId,
            copyId: copy._id,
            fineType: 'DAMAGE',
            amount: amount,
            remainingAmount: amount,
            notes: `Book marked as DAMAGED. ${notes}`
        });
    }

    return copy;
};
