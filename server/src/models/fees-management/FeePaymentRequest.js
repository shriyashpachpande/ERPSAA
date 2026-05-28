const mongoose = require('mongoose');

const FeePaymentRequestSchema = new mongoose.Schema({
  feeAccountId: {
    type: mongoose.Schema.ObjectId,
    ref: 'StudentFeeAccount',
    required: true
  },
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'StudentMaster',
    required: true
  },
  installmentId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  amount: { 
    type: Number, 
    required: true 
  },
  paymentMode: { 
    type: String, 
    enum: ['online'], 
    default: 'online' 
  },
  transactionId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  auditHash: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  remarks: {
    type: String
  },
  rejectionReason: {
    type: String
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('FeePaymentRequest', FeePaymentRequestSchema);
