const mongoose = require('mongoose');

const InternalMarksRecordSchema = new mongoose.Schema({
  studentMasterId: {
    type: mongoose.Schema.ObjectId,
    ref: 'StudentMaster',
    required: [true, 'Student reference is required']
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
  facultyProfileId: {
    type: mongoose.Schema.ObjectId,
    ref: 'FacultyProfile',
    required: [true, 'Faculty reference is required']
  },
  pt1Marks: {
    type: Number,
    default: 0,
    min: 0,
    max: 20
  },
  mseMarks: {
    type: Number,
    default: 0,
    min: 0,
    max: 20
  },
  pt2Marks: {
    type: Number,
    default: 0,
    min: 0,
    max: 20
  },
  semMarks: {
    type: Number,
    default: 0,
    min: 0,
    max: 60
  },
  totalInternalMarks: {
    type: Number,
    default: 0
  },
  maxInternalMarks: {
    type: Number,
    default: 120
  },
  marksStatus: {
    type: String,
    enum: ['Draft', 'Submitted', 'Locked'],
    default: 'Draft'
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

// Composite unique index to prevent duplicate marks for same student/subject context
InternalMarksRecordSchema.index({ studentMasterId: 1, academicYearId: 1, semesterId: 1, sectionId: 1, subjectId: 1 }, { unique: true });

// Pre-save hook to calculate total
InternalMarksRecordSchema.pre('save', function(next) {
  this.totalInternalMarks = (this.pt1Marks || 0) + 
                            (this.mseMarks || 0) + 
                            (this.pt2Marks || 0) + 
                            (this.semMarks || 0);
  next();
});

module.exports = mongoose.model('InternalMarksRecord', InternalMarksRecordSchema);
