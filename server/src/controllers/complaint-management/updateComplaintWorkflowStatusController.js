const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const isValidTransition = require('../../modules/complaint-management/validateComplaintStatusTransitionService');
const createAuditEntry = require('../../modules/complaint-management/createComplaintAuditEntryService');
const { validateUpdateComplaintStatus } = require('../../validators/complaint-management/updateComplaintStatusRequestValidator');

/**
 * @desc    Update complaint workflow status (Transition check)
 * @route   PUT /api/complaints/update-status/:id
 * @access  Private (Handler)
 */
const updateComplaintWorkflowStatus = async (req, res, next) => {
    try {
        const { isValid, errors } = validateUpdateComplaintStatus(req.body);
        if (!isValid) return res.status(400).json({ success: false, errors });

        const complaint = await ComplaintTicket.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });

        if (!isValidTransition(complaint.status, req.body.status)) {
            return res.status(400).json({ success: false, error: `Cannot transition from ${complaint.status} to ${req.body.status}` });
        }

        const oldStatus = complaint.status;
        complaint.status = req.body.status;
        complaint.lastUpdatedBy = req.user._id;

        await complaint.save();

        await createAuditEntry({
            complaintId: complaint._id,
            action: 'UPDATE_STATUS',
            previousStatus: oldStatus,
            newStatus: req.body.status,
            performedBy: req.user._id,
            performedByRole: req.user.role,
            remarks: req.body.remarks || 'Status updated by handler'
        });

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        next(err);
    }
};

module.exports = updateComplaintWorkflowStatus;
