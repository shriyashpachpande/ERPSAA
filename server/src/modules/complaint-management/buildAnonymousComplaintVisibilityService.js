/**
 * Sanitizes complaint data based on anonymity rules.
 * @param {object} complaint 
 * @param {string} userRole 
 * @returns {object}
 */
const buildAnonymousVisibility = (complaint, userRole) => {
    const sanitized = complaint.toObject ? complaint.toObject() : { ...complaint };

    if (sanitized.isAnonymous && userRole !== 'super_admin' && userRole !== 'admin') {
        // Hide student details from primary handler-facing UI
        sanitized.studentSnapshot = {
            fullName: 'Anonymous',
            email: 'Hidden',
            department: sanitized.studentSnapshot?.department || 'Hidden'
        };
        delete sanitized.studentId;
    }

    return sanitized;
};

module.exports = buildAnonymousVisibility;
