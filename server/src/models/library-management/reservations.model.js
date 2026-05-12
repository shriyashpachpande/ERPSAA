const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    reservationId: {
        type: String,
        required: true,
        unique: true
    },
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'StudentMaster',
        required: true
    },
    bookId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'NOTIFIED', 'COLLECTED', 'EXPIRED', 'CANCELLED'],
        default: 'ACTIVE'
    },
    queuePosition: {
        type: Number,
        required: true
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    notifiedAt: Date,
    expiresAt: Date,
    fulfilledAt: Date,
    cancelledAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservation', ReservationSchema);
