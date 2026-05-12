const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');

/**
 * @desc    Get queue of complaints assigned specifically to the current user
 * @route   GET /api/complaints/assigned-queue
 * @access  Private (Handler)
 */
const getAssignedComplaintQueue = async (req, res, next) => {
    try {
        const statusFilter = req.query.status;
        let query = { assignedTo: req.user._id };
        
        if (statusFilter) {
            query.status = statusFilter;
        } else {
            query.status = { $nin: ['closed', 'rejected'] };
        }

        const complaints = await ComplaintTicket.find(query)
            .sort({ priority: -1, createdAt: 1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getAssignedComplaintQueue;
