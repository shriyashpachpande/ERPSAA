const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const { COMPLAINT_STATUS } = require('../../constants/complaint-management/complaintStatusConstants');
const createAuditEntry = require('./createComplaintAuditEntryService');

/**
 * Executes escalation logic for overdue or unresolved complaints.
 * @param {string} complaintId 
 * @param {string} reason 
 * @returns {Promise<object>}
 */
const escalateComplaint = async (complaintId, reason) => {
    const complaint = await ComplaintTicket.findById(complaintId);
    if (!complaint) throw new Error('Complaint not found');

    const oldStatus = complaint.status;
    complaint.status = COMPLAINT_STATUS.ESCALATED;
    complaint.escalationLevel += 1;
    complaint.escalationReason = reason;
    complaint.lastUpdatedBy = complaint.assignedTo; // Or system user if automated

    await complaint.save();

    await createAuditEntry({
        complaintId,
        action: 'ESCALATE',
        previousStatus: oldStatus,
        newStatus: COMPLAINT_STATUS.ESCALATED,
        performedBy: complaint.assignedTo || complaint.studentId, // Placeholder
        performedByRole: 'system',
        remarks: reason
    });

    return complaint;
};

module.exports = escalateComplaint;
