const mongoose = require('mongoose');

const SemesterSubjectMappingSchema = new mongoose.Schema({
  academicYearId: {
    type: mongoose.Schema.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'Academic year is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  semesterId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Semester',
    required: [true, 'Semester is required']
  },
  subjectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'AcademicSubject',
    required: [true, 'Subject is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
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

// Ensure unique mapping: Subject cannot be mapped twice to the same semester in same year and same department
SemesterSubjectMappingSchema.index({ academicYearId: 1, department: 1, semesterId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('SemesterSubjectMapping', SemesterSubjectMappingSchema);
