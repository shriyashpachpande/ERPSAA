const mongoose = require('mongoose');

const ModulePlacementSchema = new mongoose.Schema({
  status: { type: String, default: 'pending' },
  lastUpdated: { type: Date, default: Date.now },
  notes: { type: String }
}, { _id: false });

const StudentMasterSchema = new mongoose.Schema({
  // CORE IDENTITY LINKAGE
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  admissionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'AdmissionApplication',
    required: true,
    unique: true
  },
  
  // INSTITUTIONAL RECORD
  studentId: {
    type: String,
    required: true,
    unique: true,
    index: true // STU-YYYY-XXXX
  },
  enrollmentStatus: {
    type: String,
    enum: ['active', 'graduated', 'suspended', 'withdrawn', 'on_leave'],
    default: 'active'
  },
  
  // ACADEMIC PROFILE (Inherited & Evolving)
  academicProfile: {
    department: { type: String, required: true },
    course: { type: String, required: true },
    specialization: { type: String },
    batch: { type: String }, // e.g. 2026-2030
    currentSemester: { type: Number, default: 1 },
    enrollmentDate: { type: Date, default: Date.now }
  },

  // PERSONAL & CONTACT (Cached from Admission for fast indexing)
  personalDetails: {
    fullName: String,
    dateOfBirth: Date,
    gender: String,
    bloodGroup: String,
    profilePhotoUrl: String
  },
  contactDetails: {
    email: String,
    mobileNumber: String,
    emergencyContact: String
  },

  // MODULE PLACEHOLDERS (Future-Ready ERP Integration)
  modules: {
    fees: { type: ModulePlacementSchema, default: () => ({ status: 'unpaid' }) },
    hostel: { type: ModulePlacementSchema, default: () => ({ status: 'not_allocated' }) },
    library: { type: ModulePlacementSchema, default: () => ({ status: 'no_dues' }) },
    attendance: { type: ModulePlacementSchema, default: () => ({ status: 'active' }) },
    complaints: { type: ModulePlacementSchema, default: () => ({ status: 'clear' }) }
  },

  // SECURE DOCUMENTATION VAULT (Inherited from Admission)
  uploadedDocuments: {
    tenthMarksheet:        { type: mongoose.Schema.Types.Mixed, default: null },
    twelfthMarksheet:      { type: mongoose.Schema.Types.Mixed, default: null },
    transferCertificate:   { type: mongoose.Schema.Types.Mixed, default: null },
    migrationCertificate:  { type: mongoose.Schema.Types.Mixed, default: null },
    casteCertificate:      { type: mongoose.Schema.Types.Mixed, default: null },
    incomeCertificate:     { type: mongoose.Schema.Types.Mixed, default: null },
    passportPhoto:         { type: mongoose.Schema.Types.Mixed, default: null },
    idProof:               { type: mongoose.Schema.Types.Mixed, default: null },
    domicileCertificate:   { type: mongoose.Schema.Types.Mixed, default: null },
    entranceScorecard:     { type: mongoose.Schema.Types.Mixed, default: null },
    disabilityCertificate: { type: mongoose.Schema.Types.Mixed, default: null }
  },

  // AUDIT & UPDATE HISTORY
  history: [{
    action: String,
    changedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    details: mongoose.Schema.Types.Mixed
  }]

}, {
  timestamps: true
});

module.exports = mongoose.model('StudentMaster', StudentMasterSchema);
