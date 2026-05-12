const bookRequestService = require('../../services/library-management/bookRequest.service');

const createRequest = async (req, res) => {
    try {
        const request = await bookRequestService.createRequest(req.user.studentProfileId || req.body.studentId, req.body);
        res.status(201).json({ success: true, data: request });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const getStudentRequests = async (req, res) => {
    try {
        const requests = await bookRequestService.getStudentRequests(req.params.studentId);
        res.status(200).json({ success: true, data: requests });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const requests = await bookRequestService.getAllRequests();
        res.status(200).json({ success: true, data: requests });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const reviewRequest = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const request = await bookRequestService.reviewRequest(req.params.id, req.user._id, status, remarks);
        res.status(200).json({ success: true, data: request });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = {
    createRequest,
    getStudentRequests,
    getAllRequests,
    reviewRequest
};
