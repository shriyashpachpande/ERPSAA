const escalateComplaint = require('../../modules/complaint-management/complaintEscalationEngineService');

/**
 * @desc    Escalate an overdue or complex complaint
 * @route   PUT /api/complaints/escalate/:id
 * @access  Private (Handler/Admin)
 */
const escalateOverdueComplaint = async (req, res, next) => {
    try {
        const { reason } = req.body;
        if (!reason) return res.status(400).json({ success: false, error: 'Escalation reason is required' });

        const complaint = await escalateComplaint(req.params.id, reason);

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        next(err);
    }
};

module.exports = escalateOverdueComplaint;
