const mongoose = require('mongoose');

const HostelAllocationSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.ObjectId, ref: 'HostelApplication', required: true },
  studentId: { type: mongoose.Schema.ObjectId, ref: 'StudentMaster', required: true },
  bedId: { type: mongoose.Schema.ObjectId, ref: 'HostelBed', required: true },
  roomId: { type: mongoose.Schema.ObjectId, ref: 'HostelRoom', required: true },
  floorId: { type: mongoose.Schema.ObjectId, ref: 'HostelFloor', required: true },
  blockId: { type: mongoose.Schema.ObjectId, ref: 'HostelBlock', required: true },
  hostelId: { type: mongoose.Schema.ObjectId, ref: 'Hostel', required: true },
  allocationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Vacated', 'Transferred'], default: 'Active' },
  vacatedDate: { type: Date }
}, { timestamps: true });

// A student can have only one active allocation
HostelAllocationSchema.index({ studentId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'Active' } });

module.exports = mongoose.model('HostelAllocation', HostelAllocationSchema);
