const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
  semesterNumber: {
    type: Number,
    required: [true, 'Semester number is required'],
    min: 1,
    max: 10
  },
  semesterName: {
    type: String,
    required: [true, 'Semester name is required']
    // example: "Semester 1"
  },
  academicYearId: {
    type: mongoose.Schema.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'Academic year is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'concluded'],
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

// Ensure unique semesterNumber per academicYearId
SemesterSchema.index({ semesterNumber: 1, academicYearId: 1 }, { unique: true });

module.exports = mongoose.model('Semester', SemesterSchema);
