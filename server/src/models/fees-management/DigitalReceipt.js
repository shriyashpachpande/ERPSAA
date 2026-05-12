const mongoose = require('mongoose');

const DigitalReceiptSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  paymentEntryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'FeePaymentEntry',
    required: true,
    unique: true
  },
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'StudentMaster',
    required: true
  },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('DigitalReceipt', DigitalReceiptSchema);
