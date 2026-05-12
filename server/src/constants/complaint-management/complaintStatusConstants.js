const COMPLAINT_STATUS = {
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    ASSIGNED: 'assigned',
    IN_PROGRESS: 'in_progress',
    WAITING_FOR_STUDENT: 'waiting_for_student',
    RESOLVED: 'resolved',
    REOPENED: 'reopened',
    REJECTED: 'rejected',
    CLOSED: 'closed',
    ESCALATED: 'escalated'
};

const STATUS_LIST = Object.values(COMPLAINT_STATUS);

module.exports = {
    COMPLAINT_STATUS,
    STATUS_LIST
};
