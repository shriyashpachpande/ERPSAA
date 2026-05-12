const ComplaintMessageThread = require('../../models/complaint-management/complaintMessageThreadModel');
const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const { validateAddComplaintMessage } = require('../../validators/complaint-management/addComplaintMessageRequestValidator');

/**
 * @desc    Add a message to the complaint conversation thread
 * @route   POST /api/complaints/add-message/:id
 * @access  Private (Handler/Student)
 */
const addComplaintConversationMessage = async (req, res, next) => {
    try {
        const { isValid, errors } = validateAddComplaintMessage(req.body);
        if (!isValid) return res.status(400).json({ success: false, errors });

        const complaint = await ComplaintTicket.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });

        const message = await ComplaintMessageThread.create({
            complaintId: complaint._id,
            sender: req.user._id,
            senderRole: req.user.role,
            message: req.body.message,
            isInternal: req.body.isInternal || false,
            attachments: req.body.attachments || []
        });

        res.status(201).json({ success: true, data: message });
    } catch (err) {
        next(err);
    }
};

module.exports = addComplaintConversationMessage;
