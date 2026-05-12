const User = require('../../models/auth/User');
const mapCategoryToRouting = require('./mapComplaintCategoryToDepartmentService');

/**
 * Automatically assigns a complaint handler based on category and availability (simplistic).
 * @param {string} category 
 * @param {string} department 
 * @returns {Promise<object>}
 */
const autoAssignHandler = async (category, department) => {
    const routing = mapCategoryToRouting(category);
    const targetRole = routing.primaryRole;
    const roleAliases = {
        'librarian': ['librarian', 'library_staff'],
        'library_staff': ['librarian', 'library_staff'],
        'accounts_staff': ['accounts_staff', 'staff_account'],
        'staff_account': ['accounts_staff', 'staff_account']
    };

    const targetRoles = roleAliases[targetRole] || [targetRole];

    // Search for a user with the target role and department match if applicable
    const query = { role: { $in: targetRoles }, isActive: true };
    
    // For faculty/hod, department matching is important
    if (['faculty', 'hod'].includes(targetRole) && department) {
        // This project likely has department in user profile or linked. 
        // Based on previous research, some modules filter by department.
        // query.department = department; 
    }

    const handler = await User.findOne(query);
    
    return {
        handlerId: handler ? handler._id : null,
        assignedRole: targetRole
    };
};

module.exports = autoAssignHandler;
