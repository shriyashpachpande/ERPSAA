const AuditLog = require('../../models/library-management/auditLogs.model');

const logAction = async (data) => {
    return await AuditLog.create(data);
};

const getLogs = async (filters = {}) => {
    return await AuditLog.find(filters)
        .populate('performedBy', 'fullName username email')
        .sort({ timestamp: -1 })
        .limit(100);
};

module.exports = {
    logAction,
    getLogs
};
