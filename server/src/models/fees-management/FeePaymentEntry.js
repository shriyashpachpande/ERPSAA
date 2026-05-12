const mongoose = require('mongoose');

const FeePaymentEntrySchema = new mongoose.Schema({
  feeAccountId: {
    type: mongoose.Schema.ObjectId,
    ref: 'StudentFeeAccount',
    required: true
  },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMode: {
    type: String,
    enum: ['cash', 'online', 'cheque', 'bank_transfer'],
    required: true
  },
  transactionId: { type: String, unique: true, sparse: true },
  remarks: String,
  receivedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  receiptGenerated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('FeePaymentEntry', FeePaymentEntrySchema);
