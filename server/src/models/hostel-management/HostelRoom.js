const mongoose = require('mongoose');

const HostelRoomSchema = new mongoose.Schema({
  floorId: { type: mongoose.Schema.ObjectId, ref: 'HostelFloor', required: true },
  roomNumber: { type: String, required: true },
  roomType: { type: String, enum: ['Single', 'Double', 'Triple', 'Four-Seater'], required: true },
  capacity: { type: Number, required: true },
  occupiedCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

HostelRoomSchema.index({ floorId: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('HostelRoom', HostelRoomSchema);
