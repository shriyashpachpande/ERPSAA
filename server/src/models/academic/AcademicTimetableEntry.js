const mongoose = require('mongoose');

const AcademicTimetableEntrySchema = new mongoose.Schema({
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
  dayOfWeek: {
    type: String,
    required: [true, 'Day of week is required'],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  roomNumber: String,
  type: {
    type: String,
    enum: ['Lecture', 'Practical', 'Tutorial'],
    default: 'Lecture'
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

module.exports = mongoose.model('AcademicTimetableEntry', AcademicTimetableEntrySchema);
