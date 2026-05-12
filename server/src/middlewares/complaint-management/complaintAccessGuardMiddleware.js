const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');

/**
 * Middleware to check if the user has access to a specific complaint.
 */
const complaintAccessGuard = async (req, res, next) => {
    try {
        const complaint = await ComplaintTicket.findById(req.params.complaintId || req.params.id);
        
        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }

        const user = req.user;

        // Admin/Super Admin always have access
        if (['super_admin', 'admin'].includes(user.role)) {
            req.complaint = complaint;
            return next();
        }

        // Students can only access their own complaints
        if (user.role === 'student') {
            if (complaint.studentId.toString() !== user._id.toString()) {
                return res.status(403).json({ success: false, error: 'Not authorized to access this complaint' });
            }
            req.complaint = complaint;
            return next();
        }

        // Handlers can access complaints assigned to them or their department/role
        const isAssignedToUser = complaint.assignedTo && complaint.assignedTo.toString() === user._id.toString();
        
        // Handle role aliases for consistent access
        const roleAliases = {
            'librarian': ['librarian', 'library_staff'],
            'library_staff': ['librarian', 'library_staff'],
            'accounts_staff': ['accounts_staff', 'staff_account'],
            'staff_account': ['accounts_staff', 'staff_account']
        };

        const allowedAliases = roleAliases[complaint.assignedRole] || [complaint.assignedRole];
        const isRoleMatch = allowedAliases.includes(user.role);
        
        if (isAssignedToUser || isRoleMatch) {
            req.complaint = complaint;
            return next();
        }

        return res.status(403).json({ success: false, error: 'Not authorized to access this complaint' });
    } catch (err) {
        next(err);
    }
};

module.exports = complaintAccessGuard;
