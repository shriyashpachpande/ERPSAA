const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const createAuditEntry = require('../../modules/complaint-management/createComplaintAuditEntryService');
const { validateAssignComplaint } = require('../../validators/complaint-management/assignComplaintRequestValidator');
const { COMPLAINT_STATUS } = require('../../constants/complaint-management/complaintStatusConstants');

/**
 * @desc    Assign or reassign a complaint to a specific handler
 * @route   PUT /api/complaints/assign-handler/:id
 * @access  Private (Admin/HOD)
 */
const assignComplaintToHandler = async (req, res, next) => {
    try {
        const { isValid, errors } = validateAssignComplaint(req.body);
        if (!isValid) return res.status(400).json({ success: false, errors });

        const complaint = await ComplaintTicket.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });

        const oldHandler = complaint.assignedTo;
        complaint.assignedTo = req.body.handlerId;
        complaint.status = COMPLAINT_STATUS.ASSIGNED;
        
        await complaint.save();

        await createAuditEntry({
            complaintId: complaint._id,
            action: 'ASSIGN',
            previousStatus: complaint.status,
            newStatus: COMPLAINT_STATUS.ASSIGNED,
            performedBy: req.user._id,
            performedByRole: req.user.role,
            remarks: `Assigned to handler ${req.body.handlerId}`,
            metadata: { oldHandler, newHandler: req.body.handlerId }
        });

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        next(err);
    }
};

module.exports = assignComplaintToHandler;
