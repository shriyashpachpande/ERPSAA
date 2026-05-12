const mongoose = require('mongoose');
const { CATEGORY_LIST } = require('../../constants/complaint-management/complaintCategoryConstants');

const ComplaintCategoryRoutingConfigSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: CATEGORY_LIST,
        required: true,
        unique: true
    },
    primaryRole: {
        type: String,
        required: true
    },
    escalationRole: {
        type: String,
        required: true
    },
    finalAuthorityRole: {
        type: String,
        required: true,
        default: 'super_admin'
    },
    slaHours: {
        type: Number,
        default: 48 // 48 hours for resolution
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ComplaintCategoryRoutingConfig', ComplaintCategoryRoutingConfigSchema);
