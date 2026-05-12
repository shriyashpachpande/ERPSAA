const mongoose = require('mongoose');

const FacultyProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    index: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    default: 'IT'
  },
  designation: {
    type: String,
    required: [true, 'Designation is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  personalEmail: {
    type: String,
    required: [true, 'Personal email is required']
  },
  erpEmail: {
    type: String,
    required: [true, 'ERP email is required'],
    unique: true
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FacultyProfile', FacultyProfileSchema);
