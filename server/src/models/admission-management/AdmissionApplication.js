const mongoose = require('mongoose');

// ─── Reusable sub-schema for a single uploaded file's metadata ───────────────
const FileMetaSchema = new mongoose.Schema({
  originalName: String,
  storedName: String,
  filePath: String,   // e.g. '/uploads/admission-documents/filename.pdf'
  mimeType: String,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const AdmissionApplicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  linkedUserId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  applicationStatus: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'pending_clarification', 'reupload_requested', 'rejected', 'approved'],
    default: 'draft'
  },
  admissionYear: {
    type: Number,
    required: true
  },
  personalDetails: {
    fullName: String,
    fatherName: String,
    motherName: String,
    gender: String,
    dateOfBirth: Date,
    bloodGroup: String,
    nationality: String,
    category: String,
    religion: String,
    mobileNumber: String,
    alternateMobile: String,
    email: String,
    aadhaarId: String,
    // profilePhotoUrl is now built by the backend from the stored file path
    profilePhotoUrl: String
  },
  addressDetails: {
    current: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      district: String,
      state: String,
      pincode: String
    },
    permanentSameAsCurrent: { type: Boolean, default: false },
    permanent: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      district: String,
      state: String,
      pincode: String
    }
  },
  academicDetails: {
    tenthBoard: String,
    tenthSchool: String,
    tenthPassingYear: String,
    tenthScore: String,
    twelfthBoard: String,
    twelfthCollege: String,
    twelfthPassingYear: String,
    twelfthScore: String,
    entranceExamName: String,
    entranceScore: String,
    rank: String,
    previousCollege: String,
    transferCertificateNumber: String
  },
  courseSelection: {
    programType: String,
    department: String,
    course: String,
    specialization: String,
    admissionType: String,
    categoryQuota: String,
    preferredHostel: { type: Boolean, default: false },
    scholarshipApplied: { type: Boolean, default: false }
  },
  guardianDetails: {
    guardianName: String,
    guardianRelation: String,
    guardianPhone: String,
    guardianOccupation: String,
    emergencyContactName: String,
    emergencyContactPhone: String,
    emergencyContactRelation: String
  },
  // Each field now stores full file metadata instead of a bare string
  uploadedDocuments: {
    tenthMarksheet:        { type: FileMetaSchema, default: null },
    twelfthMarksheet:      { type: FileMetaSchema, default: null },
    transferCertificate:   { type: FileMetaSchema, default: null },
    migrationCertificate:  { type: FileMetaSchema, default: null },
    casteCertificate:      { type: FileMetaSchema, default: null },
    incomeCertificate:     { type: FileMetaSchema, default: null },
    passportPhoto:         { type: FileMetaSchema, default: null },
    idProof:               { type: FileMetaSchema, default: null },
    domicileCertificate:   { type: FileMetaSchema, default: null },
    entranceScorecard:     { type: FileMetaSchema, default: null },
    disabilityCertificate: { type: FileMetaSchema, default: null }
  },
  verificationSummary: {
    comments: String,
    status: String
  },
  adminComments: [
    {
      comment: String,
      addedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  rejectionReason: String,
  requestedReuploadFields: [String],
  submittedAt: Date,
  approvedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdmissionApplication', AdmissionApplicationSchema);
