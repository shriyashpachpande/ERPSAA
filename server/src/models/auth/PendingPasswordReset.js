const mongoose = require('mongoose');

const PendingPasswordResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpire: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 } // 15 minutes TTL
});

module.exports = mongoose.model('PendingPasswordReset', PendingPasswordResetSchema);
