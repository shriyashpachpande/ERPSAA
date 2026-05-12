const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');

/**
 * @desc    Get list of complaints raised by the current student
 * @route   GET /api/complaints/my-list
 * @access  Private (Student)
 */
const getStudentOwnComplaintList = async (req, res, next) => {
    try {
        const complaints = await ComplaintTicket.find({ studentId: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getStudentOwnComplaintList;
