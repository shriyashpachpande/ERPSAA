const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FacilityCategory',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String
  },
  capacity: {
    type: Number,
    default: 0
  },
  rules: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['available', 'maintenance', 'out_of_service'],
    default: 'available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);
