const mongoose = require('mongoose');

const AcademicYearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Academic year name is required'],
    unique: true,
    trim: true
    // example: "2026-2027"
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
    enum: ['active', 'inactive'],
    default: 'active'
  },
  isCurrent: {
    type: Boolean,
    default: false
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

// Middleware to ensure only one isCurrent=true
AcademicYearSchema.pre('save', async function() {
  if (this.isCurrent) {
    await this.constructor.updateMany({ _id: { $ne: this._id } }, { isCurrent: false });
  }
});

module.exports = mongoose.model('AcademicYear', AcademicYearSchema);
