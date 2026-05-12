const mongoose = require('mongoose');

const HealthIncidentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'StudentMaster',
        required: true
    },
    incidentType: {
        type: String,
        enum: ['Medical', 'Injury', 'Emergency'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Reporting faculty/admin
        required: true
    },
    dateTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    resolutionNotes: {
        type: String
    },
    closedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    closedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HealthIncident', HealthIncidentSchema);
