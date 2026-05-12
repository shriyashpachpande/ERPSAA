const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const createAuditEntry = require('../../modules/complaint-management/createComplaintAuditEntryService');
const { COMPLAINT_STATUS } = require('../../constants/complaint-management/complaintStatusConstants');

/**
 * @desc    Reopen a resolved complaint (Requested by student)
 * @route   PUT /api/complaints/reopen/:id
 * @access  Private (Student)
 */
const reopenResolvedComplaint = async (req, res, next) => {
    try {
        const { reason } = req.body;
        if (!reason) return res.status(400).json({ success: false, error: 'Reopen reason is required' });

        const complaint = await ComplaintTicket.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });

        if (complaint.status !== COMPLAINT_STATUS.RESOLVED) {
            return res.status(400).json({ success: false, error: 'Only resolved complaints can be reopened' });
        }

        const oldStatus = complaint.status;
        complaint.status = COMPLAINT_STATUS.REOPENED;
        complaint.lastUpdatedBy = req.user._id;

        await complaint.save();

        await createAuditEntry({
            complaintId: complaint._id,
            action: 'REOPEN',
            previousStatus: oldStatus,
            newStatus: COMPLAINT_STATUS.REOPENED,
            performedBy: req.user._id,
            performedByRole: req.user.role,
            remarks: reason
        });

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        next(err);
    }
};

module.exports = reopenResolvedComplaint;
