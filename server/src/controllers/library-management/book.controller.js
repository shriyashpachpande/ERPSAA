const bookService = require('../../services/library-management/book.service');

exports.createBook = async (req, res) => {
    try {
        const book = await bookService.createBook(req.body);
        res.status(201).json({ success: true, data: book });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getBooks = async (req, res) => {
    try {
        const books = await bookService.getBooks(req.query);
        res.status(200).json({ success: true, count: books.length, data: books });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getBook = async (req, res) => {
    try {
        const book = await bookService.getBookById(req.params.id);
        if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
        res.status(200).json({ success: true, data: book });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await bookService.updateBook(req.params.id, req.body);
        if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
        res.status(200).json({ success: true, data: book });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await bookService.deleteBook(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
