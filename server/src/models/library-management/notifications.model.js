const mongoose = require('mongoose');

const LibraryNotificationSchema = new mongoose.Schema({
    notificationId: {
        type: String,
        required: true,
        unique: true
    },
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'StudentMaster',
        required: true
    },
    type: {
        type: String,
        enum: ['DUE_REMINDER', 'OVERDUE_ALERT', 'RESERVATION_READY', 'RESERVATION_EXPIRED', 'FINE_ALERT'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedTransactionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'IssueTransaction'
    },
    relatedReservationId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Reservation'
    },
    status: {
        type: String,
        enum: ['PENDING', 'SENT', 'READ'],
        default: 'PENDING'
    },
    sentAt: Date,
    readAt: Date,
    deliveryChannel: {
        type: String,
        default: 'DASHBOARD'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LibraryNotification', LibraryNotificationSchema);
