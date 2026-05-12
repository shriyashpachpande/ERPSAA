const auditService = require('../../services/library-management/audit.service');

const getLogs = async (req, res) => {
    try {
        const logs = await auditService.getLogs(req.query);
        res.status(200).json({ success: true, data: logs });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = {
    getLogs
};
