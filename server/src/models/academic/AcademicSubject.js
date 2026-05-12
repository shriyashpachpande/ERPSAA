const mongoose = require('mongoose');

const AcademicSubjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  subjectCode: {
    type: String,
    required: [true, 'Subject code is required'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    default: 'IT'
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: 0
  },
  subjectType: {
    type: String,
    enum: ['Core', 'Elective', 'Practical', 'Audit', 'Theory', 'Lab'],
    default: 'Theory'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AcademicSubject', AcademicSubjectSchema);
