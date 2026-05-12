const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true,
        unique: true
    },
    accessionNumber: {
        type: String,
        required: true,
        unique: true
    },
    isbn: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: String,
    author: {
        type: String,
        required: true
    },
    publisher: String,
    edition: String,
    publicationYear: Number,
    category: String,
    department: String,
    subject: String,
    shelfNumber: String,
    rackNumber: String,
    language: String,
    description: String,
    keywords: [String],
    coverImage: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', BookSchema);
