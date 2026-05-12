const { COMPLAINT_CATEGORIES } = require('./complaintCategoryConstants');

const COMPLAINT_DEPARTMENT_ROUTING = {
    [COMPLAINT_CATEGORIES.ACADEMIC]: {
        primaryRole: 'faculty',
        escalationRole: 'hod',
        finalAuthority: 'academic_admin',
        departmentRoute: 'academic_department'
    },
    [COMPLAINT_CATEGORIES.LIBRARY]: {
        primaryRole: 'librarian',
        escalationRole: 'super_admin',
        finalAuthority: 'super_admin',
        departmentRoute: 'library_department'
    },
    [COMPLAINT_CATEGORIES.FEES]: {
        primaryRole: 'accounts_staff',
        escalationRole: 'super_admin',
        finalAuthority: 'super_admin',
        departmentRoute: 'accounts_department'
    },
    [COMPLAINT_CATEGORIES.TECHNICAL]: {
        primaryRole: 'super_admin',
        escalationRole: 'super_admin',
        finalAuthority: 'super_admin',
        departmentRoute: 'it_department'
    },
    [COMPLAINT_CATEGORIES.DISCIPLINE]: {
        primaryRole: 'hod',
        escalationRole: 'academic_admin',
        finalAuthority: 'super_admin',
        departmentRoute: 'disciplinary_committee'
    },
    [COMPLAINT_CATEGORIES.TRANSPORT]: {
        primaryRole: 'super_admin',
        escalationRole: 'super_admin',
        finalAuthority: 'super_admin',
        departmentRoute: 'transport_department'
    },
    [COMPLAINT_CATEGORIES.CANTEEN]: {
        primaryRole: 'super_admin',
        escalationRole: 'super_admin',
        finalAuthority: 'super_admin',
        departmentRoute: 'canteen_department'
    },
    [COMPLAINT_CATEGORIES.OTHER]: {
        primaryRole: 'super_admin',
        escalationRole: 'super_admin',
        finalAuthority: 'super_admin',
        departmentRoute: 'general_department'
    }
};

module.exports = {
    COMPLAINT_DEPARTMENT_ROUTING
};
