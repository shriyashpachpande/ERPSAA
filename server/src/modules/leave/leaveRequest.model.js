const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'StudentMaster',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['Casual', 'Medical', 'Emergency'],
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    document: {
        type: String // Optional URL/path for medical certificate etc.
    },
    // Multi-level Approval Workflow
    approvalStage: {
        type: String,
        enum: ['Pending', 'Faculty Reviewed', 'Forwarded to HOD', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    reviewedByFaculty: { type: mongoose.Schema.ObjectId, ref: 'User' },
    reviewedByHod: { type: mongoose.Schema.ObjectId, ref: 'User' },
    level2Required: { type: Boolean, default: false },
    finalStatus: { // Preserved for ease of macro filtering
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    // Medical Validation
    isMedical: { type: Boolean, default: false },
    documentRequired: { type: Boolean, default: false },
    medicalProofUrl: { type: String },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    // Anti-Abuse
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending' // Deprecated slightly in favor of approvalStage but kept for easy legacy reference/status summary
    },
    approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
