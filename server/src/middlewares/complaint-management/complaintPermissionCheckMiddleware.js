/**
 * Middleware to check specific complaint permissions (e.g., can resolve, can reassign).
 * @param {string[]} allowedRoles 
 */
const checkComplaintPermission = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        if (allowedRoles.includes(req.user.role) || req.user.role === 'super_admin') {
            return next();
        }

        return res.status(403).json({ success: false, error: 'Insufficient permissions for this action' });
    };
};

module.exports = checkComplaintPermission;
