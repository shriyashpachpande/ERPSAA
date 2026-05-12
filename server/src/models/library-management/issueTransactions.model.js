const mongoose = require('mongoose');

const IssueTransactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'StudentMaster',
        required: true
    },
    bookId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: true
    },
    copyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'BookCopy',
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: Date,
    status: {
        type: String,
        enum: ['ISSUED', 'RETURNED', 'OVERDUE'],
        default: 'ISSUED'
    },
    issuedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    returnedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('IssueTransaction', IssueTransactionSchema);
