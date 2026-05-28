const mongoose = require('mongoose');

const BonafideRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentMaster',
    required: true
  },
  reason: {
    type: String,
    enum: ['bank_account', 'passport', 'scholarship', 'bus_pass', 'other'],
    required: true
  },
  customReason: { 
    type: String 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  certificateNumber: { 
    type: String, 
    unique: true, 
    sparse: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: { 
    type: String 
  },
  approvedAt: { 
    type: Date 
  }
}, { timestamps: true });

module.exports = mongoose.model('BonafideRequest', BonafideRequestSchema);
