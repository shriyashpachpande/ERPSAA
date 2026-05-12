exports.validateAddComplaintMessage = (data) => {
    const errors = [];
    if (!data.message) errors.push('Message content is required');

    return {
        isValid: errors.length === 0,
        errors
    };
};
