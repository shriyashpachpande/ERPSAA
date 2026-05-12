const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');

/**
 * @desc    Get analytics summary for complaints (Status & Category distribution)
 * @route   GET /api/complaints/analytics-summary
 * @access  Private (Admin/HOD)
 */
const getComplaintAnalyticsSummary = async (req, res, next) => {
    try {
        const statsByStatus = await ComplaintTicket.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const statsByCategory = await ComplaintTicket.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const recentComplaints = await ComplaintTicket.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('studentId', 'fullName')
            .populate('assignedTo', 'fullName');

        res.status(200).json({
            success: true,
            data: {
                statusDistribution: statsByStatus,
                categoryDistribution: statsByCategory,
                recentComplaints
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getComplaintAnalyticsSummary;
