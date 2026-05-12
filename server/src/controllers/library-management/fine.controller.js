const fineService = require('../../services/library-management/fine.service');

const getStudentFines = async (req, res) => {
    try {
        const fines = await fineService.getStudentFines(req.params.studentId);
        res.status(200).json({ success: true, data: fines });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const getAllFines = async (req, res) => {
    try {
        const fines = await fineService.getAllFines();
        res.status(200).json({ success: true, data: fines });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const collectPayment = async (req, res) => {
    try {
        const { fineId, amount, notes } = req.body;
        const fine = await fineService.collectPayment(fineId, amount, notes);
        res.status(200).json({ success: true, data: fine });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const waiveFine = async (req, res) => {
    try {
        const { fineId, reason } = req.body;
        const fine = await fineService.waiveFine(fineId, req.user._id, reason);
        res.status(200).json({ success: true, data: fine });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = {
    getStudentFines,
    getAllFines,
    collectPayment,
    waiveFine
};
