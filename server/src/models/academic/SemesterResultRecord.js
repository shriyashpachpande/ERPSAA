const mongoose = require('mongoose');

const SubjectResultSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'AcademicSubject',
    required: true
  },
  internalMarks: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  maxMarks: {
    type: Number,
    default: 100
  },
  grade: String,
  status: {
    type: String,
    enum: ['Pass', 'Fail', 'Absent'],
    default: 'Pass'
  }
});

const SemesterResultRecordSchema = new mongoose.Schema({
  studentId: {
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
  subjectResults: [SubjectResultSchema],
  grandTotal: {
    type: Number,
    default: 0
  },
  maxTotal: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  overallGrade: String,
  resultStatus: {
    type: String,
    enum: ['Draft', 'Generated', 'Published'],
    default: 'Draft'
  },
  publishedAt: Date,
  generatedBy: {
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

// Composite unique index for semester results
SemesterResultRecordSchema.index({ studentId: 1, academicYearId: 1, semesterId: 1 }, { unique: true });

module.exports = mongoose.model('SemesterResultRecord', SemesterResultRecordSchema);
