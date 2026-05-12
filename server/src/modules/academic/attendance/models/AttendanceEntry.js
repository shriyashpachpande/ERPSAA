const mongoose = require('mongoose');

const AttendanceEntrySchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'AttendanceSession',
        required: [true, 'Session reference is required'],
        index: true
    },
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'StudentMaster',
        required: [true, 'Student reference is required'],
        index: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Excused'],
        default: 'Present'
    }
}, {
    timestamps: true
});

// Composite index to prevent duplicate entries for same student in same session
AttendanceEntrySchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('AttendanceEntry', AttendanceEntrySchema);
