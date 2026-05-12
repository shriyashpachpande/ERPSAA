const mongoose = require('mongoose');

const HostelApplicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.ObjectId, ref: 'StudentMaster', required: true },
  hostelType: { type: String, enum: ['Boys', 'Girls'], required: true },
  preferredHostelId: { type: mongoose.Schema.ObjectId, ref: 'Hostel' },
  preferredRoomType: { type: String, enum: ['Single', 'Double', 'Triple', 'Four-Seater'] },
  medicalCondition: { type: String },
  localGuardianName: { type: String },
  localGuardianPhone: { type: String },
  emergencyContactName: { type: String },
  emergencyContactPhone: { type: String },
  addressProofUrl: { type: String },
  declarationAccepted: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Waitlisted', 'Allocated', 'CheckedIn'], 
    default: 'Pending' 
  },
  adminRemarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HostelApplication', HostelApplicationSchema);
