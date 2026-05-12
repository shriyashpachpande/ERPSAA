const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');

/**
 * @desc    Get status tracking list for student complaints
 * @route   GET /api/complaints/my-status
 * @access  Private (Student)
 */
const getStudentComplaintStatusList = async (req, res, next) => {
    try {
        const complaints = await ComplaintTicket.find({ studentId: req.user._id })
            .select('complaintCode title status priority createdAt updatedAt')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            data: complaints
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getStudentComplaintStatusList;
