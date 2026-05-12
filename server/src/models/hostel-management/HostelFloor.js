const mongoose = require('mongoose');

const HostelFloorSchema = new mongoose.Schema({
  blockId: { type: mongoose.Schema.ObjectId, ref: 'HostelBlock', required: true },
  floorNumber: { type: Number, required: true }, // 0 for Ground, 1, 2, etc.
  name: { type: String } // e.g. Ground Floor, First Floor
}, { timestamps: true });

HostelFloorSchema.index({ blockId: 1, floorNumber: 1 }, { unique: true });

module.exports = mongoose.model('HostelFloor', HostelFloorSchema);
