const mongoose = require('mongoose');

const HostelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Boys', 'Girls'], required: true },
  description: { type: String },
  contactPerson: { type: String },
  contactNumber: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Hostel', HostelSchema);
