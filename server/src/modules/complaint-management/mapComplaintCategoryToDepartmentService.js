const { COMPLAINT_DEPARTMENT_ROUTING } = require('../../constants/complaint-management/complaintDepartmentRoutingConstants');

/**
 * Maps a complaint category to its corresponding department routing configuration.
 * @param {string} category 
 * @returns {object}
 */
const mapCategoryToRouting = (category) => {
    return COMPLAINT_DEPARTMENT_ROUTING[category] || COMPLAINT_DEPARTMENT_ROUTING.other;
};

module.exports = mapCategoryToRouting;
