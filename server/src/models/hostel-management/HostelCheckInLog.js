const mongoose = require('mongoose');

const HostelCheckInLogSchema = new mongoose.Schema({
  allocationId: { type: mongoose.Schema.ObjectId, ref: 'HostelAllocation', required: true },
  studentId: { type: mongoose.Schema.ObjectId, ref: 'StudentMaster', required: true },
  type: { type: String, enum: ['Check-In', 'Check-Out'], required: true },
  timestamp: { type: Date, default: Date.now },
  remarks: { type: String },
  performedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('HostelCheckInLog', HostelCheckInLogSchema);
