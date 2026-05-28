const IssueRequest = require('../../models/library-management/issueRequests.model');
const auditService = require('./audit.service');
const crypto = require('crypto');

const createRequest = async (studentId, data) => {
    // Generate a unique ID for the request
    const requestId = `BORROW-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
    
    const request = new IssueRequest({
        ...data,
        requestId,
        studentId,
        status: 'PENDING'
    });
    
    return await request.save();
};

const getStudentRequests = async (studentId) => {
    return await IssueRequest.find({ studentId })
        .populate('bookId', 'title author')
        .sort({ createdAt: -1 });
};

const getAllRequests = async () => {
    return await IssueRequest.find()
        .populate('studentId', 'personalDetails studentId')
        .populate('bookId', 'title author accessionNumber')
        .sort({ createdAt: -1 });
};

const reviewRequest = async (id, userId, status, remarks) => {
    const updated = await IssueRequest.findByIdAndUpdate(id, {
        status,
        reviewedBy: userId,
        reviewedAt: new Date(),
        adminRemarks: remarks
    }, { new: true });

    await auditService.logAction({
        action: 'ISSUE_REQUEST_REVIEW',
        performedBy: userId,
        targetId: id,
        targetType: 'IssueRequest',
        newValues: { status, remarks }
    });

    return updated;
};

module.exports = {
    createRequest,
    getStudentRequests,
    getAllRequests,
    reviewRequest
};
