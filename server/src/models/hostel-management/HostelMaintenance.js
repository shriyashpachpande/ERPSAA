const mongoose = require('mongoose');

const HostelMaintenanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.ObjectId, ref: 'StudentMaster', required: true },
  hostelId: { type: mongoose.Schema.ObjectId, ref: 'Hostel', required: true },
  roomId: { type: mongoose.Schema.ObjectId, ref: 'HostelRoom', required: true },
  issueType: { type: String, required: true }, // e.g. Electrical, Plumbing, Furniture
  description: { type: String, required: true },
  urgency: { type: String, enum: ['Low', 'Medium', 'High', 'Emergency'], default: 'Low' },
  status: { type: String, enum: ['Pending', 'Assigned', 'In-Progress', 'Resolved', 'Closed'], default: 'Pending' },
  assignedTo: { type: String },
  resolvedAt: { type: Date },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HostelMaintenance', HostelMaintenanceSchema);
