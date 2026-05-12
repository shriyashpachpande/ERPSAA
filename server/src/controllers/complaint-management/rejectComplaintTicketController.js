const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const createAuditEntry = require('../../modules/complaint-management/createComplaintAuditEntryService');
const { COMPLAINT_STATUS } = require('../../constants/complaint-management/complaintStatusConstants');

/**
 * @desc    Reject a complaint with a reason
 * @route   PUT /api/complaints/reject/:id
 * @access  Private (Handler/Admin)
 */
const rejectComplaintTicket = async (req, res, next) => {
    try {
        const { reason } = req.body;
        if (!reason) return res.status(400).json({ success: false, error: 'Rejection reason is required' });

        const complaint = await ComplaintTicket.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });

        const oldStatus = complaint.status;
        complaint.status = COMPLAINT_STATUS.REJECTED;
        complaint.rejectionReason = reason;
        complaint.lastUpdatedBy = req.user._id;

        await complaint.save();

        await createAuditEntry({
            complaintId: complaint._id,
            action: 'REJECT',
            previousStatus: oldStatus,
            newStatus: COMPLAINT_STATUS.REJECTED,
            performedBy: req.user._id,
            performedByRole: req.user.role,
            remarks: reason
        });

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        next(err);
    }
};

module.exports = rejectComplaintTicket;
