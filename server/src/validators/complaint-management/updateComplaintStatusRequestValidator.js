const { STATUS_LIST } = require('../../constants/complaint-management/complaintStatusConstants');

exports.validateUpdateComplaintStatus = (data) => {
    const errors = [];
    if (!data.status) errors.push('Status is required');
    else if (!STATUS_LIST.includes(data.status)) errors.push('Invalid status');

    return {
        isValid: errors.length === 0,
        errors
    };
};
