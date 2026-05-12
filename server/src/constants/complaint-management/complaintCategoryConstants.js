const COMPLAINT_CATEGORIES = {
    ACADEMIC: 'academic',
    LIBRARY: 'library',
    FEES: 'fees',
    TECHNICAL: 'technical',
    DISCIPLINE: 'discipline',
    TRANSPORT: 'transport',
    CANTEEN: 'canteen',
    OTHER: 'other'
};

const CATEGORY_LIST = Object.values(COMPLAINT_CATEGORIES);

module.exports = {
    COMPLAINT_CATEGORIES,
    CATEGORY_LIST
};
