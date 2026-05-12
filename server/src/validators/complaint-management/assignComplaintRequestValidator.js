exports.validateAssignComplaint = (data) => {
    const errors = [];
    if (!data.handlerId) errors.push('Handler ID is required');

    return {
        isValid: errors.length === 0,
        errors
    };
};
