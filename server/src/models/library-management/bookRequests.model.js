const mongoose = require('mongoose');

const BookRequestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true
    },
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'StudentMaster',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publisher: String,
    isbn: String,
    category: String,
    department: String,
    reason: String,
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'ORDERED'],
        default: 'PENDING'
    },
    reviewedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    reviewedAt: Date,
    adminRemarks: String
}, {
    timestamps: true
});

module.exports = mongoose.model('BookRequest', BookRequestSchema);
