const mongoose = require('mongoose');

const HostelComplaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.ObjectId, ref: 'StudentMaster', required: true },
  hostelId: { type: mongoose.Schema.ObjectId, ref: 'Hostel', required: true },
  roomId: { type: mongoose.Schema.ObjectId, ref: 'HostelRoom', required: true },
  category: { type: String, required: true }, // e.g. Cleaning, Noise, Behavior
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In-Progress', 'Resolved', 'Closed'], default: 'Pending' },
  resolvedAt: { type: Date },
  resolvedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HostelComplaint', HostelComplaintSchema);
