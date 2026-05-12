const mongoose = require('mongoose');

const HostelBedSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.ObjectId, ref: 'HostelRoom', required: true },
  bedNumber: { type: String, required: true },
  status: { type: String, enum: ['Vacant', 'Occupied', 'Maintenance'], default: 'Vacant' },
  currentStudent: { type: mongoose.Schema.ObjectId, ref: 'StudentMaster' }
}, { timestamps: true });

HostelBedSchema.index({ roomId: 1, bedNumber: 1 }, { unique: true });

module.exports = mongoose.model('HostelBed', HostelBedSchema);
