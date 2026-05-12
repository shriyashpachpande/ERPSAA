const { CATEGORY_LIST } = require('../../constants/complaint-management/complaintCategoryConstants');
const { PRIORITY_LIST } = require('../../constants/complaint-management/complaintPriorityConstants');

exports.validateCreateComplaint = (data) => {
    const errors = [];
    if (!data.title) errors.push('Title is required');
    if (!data.description) errors.push('Description is required');
    if (!data.category) errors.push('Category is required');
    else if (!CATEGORY_LIST.includes(data.category)) errors.push('Invalid category');
    
    if (data.priority && !PRIORITY_LIST.includes(data.priority)) {
        errors.push('Invalid priority');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
