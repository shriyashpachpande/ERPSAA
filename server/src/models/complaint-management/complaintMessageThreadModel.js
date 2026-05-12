const mongoose = require('mongoose');

const ComplaintMessageThreadSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ComplaintTicket',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderRole: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: [true, 'Message content is required']
    },
    isInternal: {
        type: Boolean,
        default: false
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        mimeType: String
    }],
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

ComplaintMessageThreadSchema.index({ complaintId: 1 });

module.exports = mongoose.model('ComplaintMessageThread', ComplaintMessageThreadSchema);
