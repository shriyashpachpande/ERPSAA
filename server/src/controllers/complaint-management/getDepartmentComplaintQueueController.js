const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');

/**
 * @desc    Get queue of complaints for the user's department or role
 * @route   GET /api/complaints/department-queue
 * @access  Private (Handler)
 */
const getDepartmentComplaintQueue = async (req, res, next) => {
    try {
        const roleAliases = {
            'librarian': ['librarian', 'library_staff'],
            'library_staff': ['librarian', 'library_staff'],
            'accounts_staff': ['accounts_staff', 'staff_account'],
            'staff_account': ['accounts_staff', 'staff_account']
        };

        const targetRoles = roleAliases[req.user.role] || [req.user.role];
        const statusFilter = req.query.status;
        const showAll = req.query.all === 'true';

        let query = {};
        
        if (statusFilter) {
            query.status = statusFilter;
        } else if (!showAll) {
            query.status = { $nin: ['closed', 'rejected', 'resolved'] };
        }

        // Strict role-based filtering
        if (showAll && ['super_admin', 'admin'].includes(req.user.role)) {
            // Bypass filtering for administrators when all=true
        } else if (targetRoles.includes('librarian')) {
            query.$or = [
                { assignedRole: { $in: targetRoles } },
                { departmentRoute: 'library_department' },
                { category: 'library' }
            ];
        } else if (targetRoles.includes('accounts_staff')) {
            query.$or = [
                { assignedRole: { $in: targetRoles } },
                { departmentRoute: 'accounts_department' },
                { category: 'fees' }
            ];
        } else if (['hod', 'faculty'].includes(req.user.role)) {
            // Academic/Departmental roles use department matching
            query.$or = [
                { assignedRole: { $in: targetRoles } },
                { departmentRoute: req.user.department }
            ];
        } else {
            // General fallback for other roles
            query.$or = [
                { assignedRole: { $in: targetRoles } },
                { departmentRoute: req.user.department }
            ];
        }

        const complaints = await ComplaintTicket.find(query)
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getDepartmentComplaintQueue;
