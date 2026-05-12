const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');

/**
 * @desc    Get detailed complaint by ID
 * @route   GET /api/complaints/details/:id
 * @access  Private (Restricted by Access Guard)
 */
const getComplaintDetailsById = async (req, res, next) => {
    try {
        const complaint = await ComplaintTicket.findById(req.params.id)
            .populate('assignedTo', 'fullName role email')
            .populate('studentId', 'fullName email department section');

        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getComplaintDetailsById;
