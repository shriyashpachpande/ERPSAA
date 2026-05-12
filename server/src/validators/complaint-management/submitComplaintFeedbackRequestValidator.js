exports.validateSubmitComplaintFeedback = (data) => {
    const errors = [];
    if (data.rating === undefined) errors.push('Rating is required');
    else if (data.rating < 1 || data.rating > 5) errors.push('Rating must be between 1 and 5');

    return {
        isValid: errors.length === 0,
        errors
    };
};
