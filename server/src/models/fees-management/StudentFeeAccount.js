// const mongoose = require('mongoose');

// const StudentFeeAccountSchema = new mongoose.Schema({
//   studentId: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'StudentMaster',
//     required: true
//   },
//   feeStructureId: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'FeeStructure',
//     required: true
//   },
//   academicYear: { type: String, required: true }, // e.g. "2026-2027"
//   currentYear: { type: Number, required: true }, // e.g. 1, 2, 3, 4
//   totalPayable: { type: Number, required: true },
//   totalPaid: { type: Number, default: 0 },
//   balance: { type: Number, required: true },
//   status: {
//     type: String,
//     enum: ['unpaid', 'partial', 'paid'],
//     default: 'unpaid'
//   },
//   installments: [{
//     dueDate: Date,
//     amount: Number,
//     status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
//   }]
// }, { timestamps: true });

// // Ensure unique account per student per year per academic cycle
// StudentFeeAccountSchema.index({ studentId: 1, currentYear: 1, academicYear: 1 }, { unique: true });

// // Auto-match balance before saving
// StudentFeeAccountSchema.pre('save', function(next) {
//   this.balance = this.totalPayable - this.totalPaid;
//   if (this.totalPaid === 0) {
//     this.status = 'unpaid';
//   } else if (this.balance <= 0) {
//     this.status = 'paid';
//   } else {
//     this.status = 'partial';
//   }
//   next();
// });

// module.exports = mongoose.model('StudentFeeAccount', StudentFeeAccountSchema);


const mongoose = require('mongoose');

const StudentFeeAccountSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'StudentMaster',
    required: true
  },
  feeStructureId: {
    type: mongoose.Schema.ObjectId,
    ref: 'FeeStructure',
    required: true
  },
  academicYear: { type: String, required: true },
  currentYear: { type: Number, required: true },
  totalPayable: { type: Number, required: true },
  totalPaid: { type: Number, default: 0 },
  balance: { type: Number, required: true },
  status: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  installments: [{
    dueDate: Date,
    amount: Number,
    status: { type: String, enum: ['pending', 'verification_pending', 'paid'], default: 'pending' }
  }],
  hostelCharges: [{
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
  }],
  totalOtherCharges: { type: Number, default: 0 }
}, { timestamps: true });

StudentFeeAccountSchema.index(
  { studentId: 1, currentYear: 1, academicYear: 1 },
  { unique: true }
);

// Auto-match balance before saving
StudentFeeAccountSchema.pre('save', function () {
  this.balance = Math.max(0, this.totalPayable - this.totalPaid);

  if (this.totalPaid === 0) {
    this.status = 'unpaid';
  } else if (this.balance <= 0) {
    this.status = 'paid';
  } else {
    this.status = 'partial';
  }
});

module.exports = mongoose.model('StudentFeeAccount', StudentFeeAccountSchema);