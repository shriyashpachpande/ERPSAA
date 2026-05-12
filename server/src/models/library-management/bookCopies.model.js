const mongoose = require('mongoose');

const BookCopySchema = new mongoose.Schema({
    copyId: {
        type: String,
        required: true,
        unique: true
    },
    bookId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: true
    },
    copyNumber: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'ISSUED', 'RESERVED', 'DAMAGED', 'LOST'],
        default: 'AVAILABLE'
    },
    shelfNumber: String,
    rackNumber: String
}, {
    timestamps: true
});

module.exports = mongoose.model('BookCopy', BookCopySchema);
