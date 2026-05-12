const mongoose = require('mongoose');

const AttendanceSessionSchema = new mongoose.Schema({
    academicYearId: {
        type: mongoose.Schema.ObjectId,
        ref: 'AcademicYear',
        required: [true, 'Academic Year is required']
    },
    semesterId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Semester',
        required: [true, 'Semester is required']
    },
    sectionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'AcademicSection',
        required: [true, 'Section is required']
    },
    subjectId: {
        type: mongoose.Schema.ObjectId,
        ref: 'AcademicSubject',
        required: [true, 'Subject is required']
    },
    facultyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'FacultyProfile',
        required: [true, 'Faculty is required']
    },
    date: {
        type: Date,
        required: [true, 'Attendance date is required']
    },
    sessionType: {
        type: String,
        enum: ['Scheduled', 'Extra'],
        default: 'Scheduled'
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required']
    },
    room: String,
    remarks: String,
    submissionStatus: {
        type: String,
        enum: ['Draft', 'Submitted'],
        default: 'Submitted'
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Duplicate Rule
AttendanceSessionSchema.index({ 
    date: 1, 
    sectionId: 1, 
    subjectId: 1, 
    startTime: 1,
    endTime: 1,
    sessionType: 1 
}, { 
    unique: true, 
    partialFilterExpression: { submissionStatus: 'Submitted' } 
});

module.exports = mongoose.model('AttendanceSession', AttendanceSessionSchema);
