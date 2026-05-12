const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const { validateSubmitComplaintFeedback } = require('../../validators/complaint-management/submitComplaintFeedbackRequestValidator');
const { COMPLAINT_STATUS } = require('../../constants/complaint-management/complaintStatusConstants');

/**
 * @desc    Submit feedback/rating for a resolved complaint
 * @route   POST /api/complaints/submit-feedback/:id
 * @access  Private (Student)
 */
const submitComplaintResolutionFeedback = async (req, res, next) => {
    try {
        const { isValid, errors } = validateSubmitComplaintFeedback(req.body);
        if (!isValid) return res.status(400).json({ success: false, errors });

        const complaint = await ComplaintTicket.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });

        if (complaint.status !== COMPLAINT_STATUS.RESOLVED && complaint.status !== COMPLAINT_STATUS.CLOSED) {
            return res.status(400).json({ success: false, error: 'Feedback can only be submitted for resolved or closed complaints' });
        }

        complaint.feedback = {
            rating: req.body.rating,
            comment: req.body.comment,
            submittedAt: new Date()
        };

        if (complaint.status === COMPLAINT_STATUS.RESOLVED) {
            complaint.status = COMPLAINT_STATUS.CLOSED;
            complaint.closedAt = new Date();
        }

        await complaint.save();

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        next(err);
    }
};

module.exports = submitComplaintResolutionFeedback;
