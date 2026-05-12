const ComplaintAuditTrail = require('../../models/complaint-management/complaintAuditTrailModel');

/**
 * Creates an audit trail entry for a complaint.
 * @param {object} params
 * @returns {Promise<object>}
 */
const createAuditEntry = async ({ complaintId, action, previousStatus, newStatus, performedBy, performedByRole, remarks, metadata }) => {
    return await ComplaintAuditTrail.create({
        complaintId,
        action,
        previousStatus,
        newStatus,
        performedBy,
        performedByRole,
        remarks,
        metadata
    });
};

module.exports = createAuditEntry;
