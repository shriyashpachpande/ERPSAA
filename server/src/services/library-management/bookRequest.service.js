const BookRequest = require('../../models/library-management/bookRequests.model');
const auditService = require('./audit.service');
const { v4: uuidv4 } = require('uuid');

const createRequest = async (studentId, data) => {
    const requestId = `REQ-${uuidv4().substring(0, 8).toUpperCase()}`;
    const request = new BookRequest({
        ...data,
        requestId,
        studentId
    });
    return await request.save();
};

const getStudentRequests = async (studentId) => {
    return await BookRequest.find({ studentId }).sort({ createdAt: -1 });
};

const getAllRequests = async () => {
    return await BookRequest.find().populate('studentId').sort({ createdAt: -1 });
};

const reviewRequest = async (id, userId, status, remarks) => {
    const updated = await BookRequest.findByIdAndUpdate(id, {
        status,
        reviewedBy: userId,
        reviewedAt: new Date(),
        adminRemarks: remarks
    }, { new: true });

    await auditService.logAction({
        action: 'REQUEST_REVIEW',
        performedBy: userId,
        targetId: id,
        targetType: 'BookRequest',
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
