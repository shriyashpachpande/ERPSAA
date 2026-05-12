const mongoose = require('mongoose');

const LibraryPolicySchema = new mongoose.Schema({
    policyName: {
        type: String,
        required: true,
        unique: true,
        default: 'STANDARD_POLICY'
    },
    studentMaxIssueLimit: {
        type: Number,
        required: true,
        default: 3
    },
    standardIssueDays: {
        type: Number,
        required: true,
        default: 14
    },
    referenceIssueDays: {
        type: Number,
        required: true,
        default: 7
    },
    gracePeriodDays: {
        type: Number,
        required: true,
        default: 2
    },
    overdueFinePerDay: {
        type: Number,
        required: true,
        default: 2
    },
    rareBookFinePerDay: {
        type: Number,
        required: true,
        default: 10
    },
    reservationHoldHours: {
        type: Number,
        required: true,
        default: 48
    },
    overdueBlockThreshold: {
        type: Number,
        required: true,
        default: 5
    },
    fineThresholdForIssueBlock: {
        type: Number,
        required: true,
        default: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LibraryPolicy', LibraryPolicySchema);
