const bookCopyService = require('../../services/library-management/bookCopy.service');

exports.createCopy = async (req, res) => {
    try {
        const copyData = { ...req.body, bookId: req.params.id };
        const copy = await bookCopyService.createCopy(copyData);
        res.status(201).json({ success: true, data: copy });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getCopies = async (req, res) => {
    try {
        const copies = await bookCopyService.getCopiesByBookId(req.params.id);
        res.status(200).json({ success: true, count: copies.length, data: copies });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
