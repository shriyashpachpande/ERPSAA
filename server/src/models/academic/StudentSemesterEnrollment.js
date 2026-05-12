const mongoose = require('mongoose');

const StudentSemesterEnrollmentSchema = new mongoose.Schema({
  studentMasterId: {
    type: mongoose.Schema.ObjectId,
    ref: 'StudentMaster',
    required: [true, 'Student reference is required']
  },
  academicYearId: {
    type: mongoose.Schema.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'Academic year is required']
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
  enrollmentStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'Cancelled', 'Completed'],
    default: 'Active'
  },
  remarks: String,
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

StudentSemesterEnrollmentSchema.index({ studentMasterId: 1, academicYearId: 1, semesterId: 1 }, { unique: true });

module.exports = mongoose.model('StudentSemesterEnrollment', StudentSemesterEnrollmentSchema);
