const mongoose = require('mongoose');

const FeeComponentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true }
}, { _id: false });

const FeeStructureSchema = new mongoose.Schema({
  course: { 
    type: String, 
    required: true,
    enum: ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BSc', 'MSc', 'BBA', 'MBA', 'BCom', 'BA', 'Diploma']
  },
  yearNumber: { type: Number, required: true }, // e.g. 1, 2, 3, 4
  academicYear: { type: String, required: true }, // e.g. "2026-2027"
  components: [FeeComponentSchema],
  totalAmount: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true });

// Ensure unique structure per course / year / academicYear
FeeStructureSchema.index({ course: 1, yearNumber: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', FeeStructureSchema);
