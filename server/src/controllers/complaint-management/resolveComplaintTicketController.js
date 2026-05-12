const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const createAuditEntry = require('../../modules/complaint-management/createComplaintAuditEntryService');
const { COMPLAINT_STATUS } = require('../../constants/complaint-management/complaintStatusConstants');

/**
 * @desc    Resolve a complaint with a summary
 * @route   PUT /api/complaints/resolve/:id
 * @access  Private (Handler)
 */
const resolveComplaintTicket = async (req, res, next) => {
    try {
        const { summary } = req.body;
        if (!summary) return res.status(400).json({ success: false, error: 'Resolution summary is required' });

        const complaint = await ComplaintTicket.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });

        const oldStatus = complaint.status;
        complaint.status = COMPLAINT_STATUS.RESOLVED;
        complaint.resolutionSummary = summary;
        complaint.resolvedAt = new Date();
        complaint.lastUpdatedBy = req.user._id;

        await complaint.save();

        await createAuditEntry({
            complaintId: complaint._id,
            action: 'RESOLVE',
            previousStatus: oldStatus,
            newStatus: COMPLAINT_STATUS.RESOLVED,
            performedBy: req.user._id,
            performedByRole: req.user.role,
            remarks: summary
        });

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        next(err);
    }
};

module.exports = resolveComplaintTicket;
