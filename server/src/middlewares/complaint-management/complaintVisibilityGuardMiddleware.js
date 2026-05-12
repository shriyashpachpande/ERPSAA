const buildAnonymousVisibility = require('../../modules/complaint-management/buildAnonymousComplaintVisibilityService');

/**
 * Middleware to intercept response and apply anonymous visibility rules.
 * This is used primarily in detail views.
 */
const complaintVisibilityGuard = (req, res, next) => {
    // This middleware works by wrapping res.json to sanitize the complaint object
    const originalJson = res.json;

    res.json = function (data) {
        if (data && data.success && data.data && (data.data.complaint || data.data.complaintCode)) {
            const complaint = data.data.complaint || data.data;
            data.data = buildAnonymousVisibility(complaint, req.user.role);
        }
        return originalJson.call(this, data);
    };

    next();
};

module.exports = complaintVisibilityGuard;
