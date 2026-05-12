const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const createAuditEntry = require('../../modules/complaint-management/createComplaintAuditEntryService');
const { COMPLAINT_STATUS } = require('../../constants/complaint-management/complaintStatusConstants');

/**
 * @desc    Close a resolved complaint after feedback
 * @route   PUT /api/complaints/close/:id
 * @access  Private (Student/Admin)
 */
const closeComplaintAfterFeedback = async (req, res, next) => {
    try {
        const complaint = await ComplaintTicket.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });

        const oldStatus = complaint.status;
        complaint.status = COMPLAINT_STATUS.CLOSED;
        complaint.closedAt = new Date();
        complaint.lastUpdatedBy = req.user._id;

        await complaint.save();

        await createAuditEntry({
            complaintId: complaint._id,
            action: 'CLOSE',
            previousStatus: oldStatus,
            newStatus: COMPLAINT_STATUS.CLOSED,
            performedBy: req.user._id,
            performedByRole: req.user.role,
            remarks: 'Complaint closed successfully'
        });

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        next(err);
    }
};

module.exports = closeComplaintAfterFeedback;
