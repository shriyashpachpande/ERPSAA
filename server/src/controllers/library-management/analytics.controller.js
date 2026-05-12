const analyticsService = require('../../services/library-management/analytics.service');

const getAdvancedAnalytics = async (req, res) => {
    try {
        const stats = await analyticsService.getAdvancedAnalytics();
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = {
    getAdvancedAnalytics
};
