const mongoose = require('mongoose');

const ComplaintAuditTrailSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ComplaintTicket',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    previousStatus: {
        type: String
    },
    newStatus: {
        type: String
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    performedByRole: {
        type: String,
        required: true
    },
    remarks: {
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

ComplaintAuditTrailSchema.index({ complaintId: 1 });

module.exports = mongoose.model('ComplaintAuditTrail', ComplaintAuditTrailSchema);
