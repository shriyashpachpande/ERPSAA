const mongoose = require('mongoose');

const PendingUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: 'student' },
  otherData: { type: mongoose.Schema.Types.Mixed },
  otp: { type: String, required: true },
  otpExpire: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 } // 15 minutes TTL
});

module.exports = mongoose.model('PendingUser', PendingUserSchema);
