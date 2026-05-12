const mongoose = require('mongoose');

const LeaveBalanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'StudentMaster',
        required: true,
        index: true
    },
    academicYear: {
        type: String, // e.g. "2026-2027"
        required: true
    },
    totalLeaves: {
        type: Number,
        default: 20
    },
    usedLeaves: {
        type: Number,
        default: 0
    },
    remainingLeaves: {
        type: Number,
        default: 20
    },
    medicalLeavesUsed: {
        type: Number,
        default: 0
    },
    casualLeavesUsed: {
        type: Number,
        default: 0
    },
    emergencyLeavesUsed: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Avoid duplicate rows for the same student in the same year
LeaveBalanceSchema.index({ studentId: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('LeaveBalance', LeaveBalanceSchema);
