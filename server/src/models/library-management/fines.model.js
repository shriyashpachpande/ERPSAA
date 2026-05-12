const mongoose = require('mongoose');

const FineSchema = new mongoose.Schema({
    fineId: {
        type: String,
        required: true,
        unique: true
    },
    transactionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'IssueTransaction'
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
    fineType: {
        type: String,
        enum: ['OVERDUE', 'DAMAGE', 'LOST'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['UNPAID', 'PARTIAL', 'PAID', 'WAIVED'],
        default: 'UNPAID'
    },
    paidAt: Date,
    waivedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    waiverReason: String,
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Fine', FineSchema);
