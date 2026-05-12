const ComplaintMessageThread = require('../../models/complaint-management/complaintMessageThreadModel');
const ComplaintAuditTrail = require('../../models/complaint-management/complaintAuditTrailModel');

/**
 * @desc    Get full conversation and audit timeline for a complaint
 * @route   GET /api/complaints/timeline/:id
 * @access  Private (Restricted)
 */
const getComplaintConversationTimeline = async (req, res, next) => {
    try {
        const messages = await ComplaintMessageThread.find({ 
            complaintId: req.params.id,
            // If student, hide internal messages
            ...(req.user.role === 'student' ? { isInternal: false } : {})
        }).populate('sender', 'fullName role').sort({ createdAt: 1 });

        const audits = await ComplaintAuditTrail.find({ 
            complaintId: req.params.id 
        }).populate('performedBy', 'fullName role').sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            data: {
                messages,
                audits
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getComplaintConversationTimeline;
