const bookCopyService = require('../../services/library-management/bookCopy.service');

const markAsLost = async (req, res) => {
    try {
        const { studentId, notes } = req.body;
        const copy = await bookCopyService.markAsLost(req.params.copyId, req.user._id, studentId, notes);
        res.status(200).json({ success: true, data: copy });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const markAsDamaged = async (req, res) => {
    try {
        const { studentId, amount, notes } = req.body;
        const copy = await bookCopyService.markAsDamaged(req.params.copyId, req.user._id, studentId, amount, notes);
        res.status(200).json({ success: true, data: copy });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = {
    markAsLost,
    markAsDamaged
};
