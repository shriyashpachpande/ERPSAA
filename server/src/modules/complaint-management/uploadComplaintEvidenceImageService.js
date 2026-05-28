const path = require('path');
const fs = require('fs');

/**
 * Handles the storage of evidence images for complaints.
 * Wraps around the existing file metadata logic.
 * @param {object} file Express.Multer.File
 * @returns {object}
 */
const uploadEvidenceImage = (file) => {
    if (!file) return null;

    // The uploadMiddleware already handles the actual move to disk.
    // This service formats the metadata for the ComplaintTicket model.
    return {
        fileName: file.originalname,
        fileUrl: `/uploads/complaint-evidence/${file.filename}`,
        mimeType: file.mimetype,
        uploadedAt: new Date()
    };
};

// Ensure directory exists
const uploadDir = path.join(__dirname, '../../../uploads/complaint-evidence');
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (err) {
    console.warn(`Warning: Could not create directory ${uploadDir} (read-only environment):`, err.message);
}

module.exports = uploadEvidenceImage;
