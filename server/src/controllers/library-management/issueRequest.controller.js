const issueRequestService = require('../../services/library-management/issueRequest.service');

const createRequest = async (req, res) => {
    try {
        const { bookId, copyId } = req.body;
        // Preferred studentId from token if available
        const studentId = req.user.studentProfileId || req.body.studentId;
        
        if (!studentId) {
            return res.status(400).json({ success: false, error: "Student profile not identified." });
        }

        const request = await issueRequestService.createRequest(studentId, { bookId, copyId });
        res.status(201).json({ success: true, data: request });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const getStudentRequests = async (req, res) => {
    try {
        const { studentId } = req.params;
        const requests = await issueRequestService.getStudentRequests(studentId);
        res.status(200).json({ success: true, data: requests });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const requests = await issueRequestService.getAllRequests();
        res.status(200).json({ success: true, data: requests });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const reviewRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;
        const request = await issueRequestService.reviewRequest(id, req.user._id, status, remarks);
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
