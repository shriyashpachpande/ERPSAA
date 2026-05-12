const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── Ensure upload directories exist ─────────────────────────────────────────
const admissionDocsDir = path.join(__dirname, '../../../uploads/admission-documents');
const profilePhotosDir = path.join(__dirname, '../../../uploads/profile-photos');

[admissionDocsDir, profilePhotosDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Disk storage for admission documents ─────────────────────────────────────
const admissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profilePhoto') {
      cb(null, profilePhotosDir);
    } else {
      cb(null, admissionDocsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// ─── File type filter ─────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/jpg', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage: admissionStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB per file
});

// ─── Fields config ────────────────────────────────────────────────────────────
const DOCUMENT_FIELDS = [
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'tenthMarksheet', maxCount: 1 },
  { name: 'twelfthMarksheet', maxCount: 1 },
  { name: 'transferCertificate', maxCount: 1 },
  { name: 'migrationCertificate', maxCount: 1 },
  { name: 'casteCertificate', maxCount: 1 },
  { name: 'incomeCertificate', maxCount: 1 },
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
  { name: 'domicileCertificate', maxCount: 1 },
  { name: 'entranceScorecard', maxCount: 1 },
  { name: 'disabilityCertificate', maxCount: 1 },
];

/**
 * Middleware to handle all admission document uploads (including profilePhoto).
 * Populates req.files as an object keyed by field name.
 */
const uploadAdmissionDocs = upload.fields(DOCUMENT_FIELDS);

/**
 * Build a metadata object for a single uploaded file.
 * @param {Express.Multer.File} file
 * @param {string} subDir - 'profile-photos' or 'admission-documents'
 */
const buildFileMeta = (file, subDir) => ({
  originalName: file.originalname,
  storedName: file.filename,
  filePath: `/uploads/${subDir}/${file.filename}`,
  mimeType: file.mimetype,
  uploadedAt: new Date()
});

module.exports = { uploadAdmissionDocs, buildFileMeta };
