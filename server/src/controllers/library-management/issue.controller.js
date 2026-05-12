const issueService = require('../../services/library-management/issue.service');

exports.issueBook = async (req, res) => {
    try {
        const issueData = { ...req.body, userId: req.user.id };
        const transaction = await issueService.issueBook(issueData);
        res.status(201).json({ success: true, data: transaction });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const returnData = { ...req.body, userId: req.user.id };
        const transaction = await issueService.returnBook(returnData);
        res.status(200).json({ success: true, data: transaction });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getStudentBooks = async (req, res) => {
    try {
        const transactions = await issueService.getStudentIssuedBooks(req.params.studentId);
        res.status(200).json({ success: true, data: transactions });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getIssuedBooks = async (req, res) => {
    try {
        const { query } = req.query;
        const transactions = await issueService.getIssuedBooks(query);
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
