const mongoose = require('mongoose');

const LibraryAuditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['FINE_WAIVE', 'POLICY_UPDATE', 'BOOK_LOST', 'BOOK_DAMAGED', 'REQUEST_REVIEW', 'ISSUE_REQUEST_REVIEW', 'RESERVATION_CANCEL']
    },
    performedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    targetType: {
        type: String,
        required: true
    },
    oldValues: mongoose.Schema.Types.Mixed,
    newValues: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LibraryAuditLog', LibraryAuditLogSchema);
