const mongoose = require('mongoose');

const AcademicSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Section name is required'],
    trim: true
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
  department: {
    type: String,
    required: [true, 'Department is required'],
    default: 'IT'
  },
  course: {
    type: String,
    required: [true, 'Course is required']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 1
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  classTeacherFacultyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'FacultyProfile'
  },
  mentorFacultyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'FacultyProfile'
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

AcademicSectionSchema.index({ name: 1, academicYearId: 1, semesterId: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('AcademicSection', AcademicSectionSchema);
