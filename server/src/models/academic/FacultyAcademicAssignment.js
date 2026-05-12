const mongoose = require('mongoose');

const FacultyAcademicAssignmentSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.ObjectId,
    ref: 'FacultyProfile',
    required: [true, 'Faculty reference is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    default: 'IT'
  },
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
  course: {
    type: String,
    required: [true, 'Course is required'],
    default: 'B.Tech - IT'
  },
  assignmentStatus: {
    type: String,
    enum: ['active', 'historical', 'suspended'],
    default: 'active'
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

FacultyAcademicAssignmentSchema.index({ faculty: 1, academicYearId: 1, semesterId: 1, sectionId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('FacultyAcademicAssignment', FacultyAcademicAssignmentSchema);
