const mongoose = require('mongoose');

const facilityCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  icon: {
    type: String // e.g., 'Volleyball', 'Book', 'Monitor' - maps to Lucide icons
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('FacilityCategory', facilityCategorySchema);
