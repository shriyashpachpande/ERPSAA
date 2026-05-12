/**
 * Calculates the SLA deadline for a complaint based on priority and category.
 * @param {string} priority 
 * @param {string} category 
 * @returns {Date}
 */
const calculateSlaDeadline = (priority, category) => {
    const now = new Date();
    let hoursToAdd = 48; // Default 48 hours

    switch (priority) {
        case 'urgent':
            hoursToAdd = 12;
            break;
        case 'high':
            hoursToAdd = 24;
            break;
        case 'medium':
            hoursToAdd = 48;
            break;
        case 'low':
            hoursToAdd = 72;
            break;
    }

    // You could also add category-specific logic here if needed
    
    return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
};

module.exports = calculateSlaDeadline;
