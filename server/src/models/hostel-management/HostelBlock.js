const mongoose = require('mongoose');

const HostelBlockSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.ObjectId, ref: 'Hostel', required: true },
  name: { type: String, required: true }, // e.g. Block A, Block B
  description: { type: String }
}, { timestamps: true });

HostelBlockSchema.index({ hostelId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('HostelBlock', HostelBlockSchema);
