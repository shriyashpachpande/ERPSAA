const mongoose = require('mongoose');
const { STATUS_LIST, COMPLAINT_STATUS } = require('../../constants/complaint-management/complaintStatusConstants');
const { CATEGORY_LIST } = require('../../constants/complaint-management/complaintCategoryConstants');
const { PRIORITY_LIST, COMPLAINT_PRIORITIES } = require('../../constants/complaint-management/complaintPriorityConstants');

const ComplaintTicketSchema = new mongoose.Schema({
    complaintCode: {
        type: String,
        unique: true,
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentSnapshot: {
        fullName: String,
        email: String,
        department: String,
        section: String,
        rollNumber: String
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: CATEGORY_LIST
    },
    priority: {
        type: String,
        required: [true, 'Please select a priority'],
        enum: PRIORITY_LIST,
        default: COMPLAINT_PRIORITIES.MEDIUM
    },
    status: {
        type: String,
        enum: STATUS_LIST,
        default: COMPLAINT_STATUS.SUBMITTED
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedRole: {
        type: String
    },
    departmentRoute: {
        type: String
    },
    escalationLevel: {
        type: Number,
        default: 0
    },
    escalationReason: {
        type: String
    },
    dueAt: {
        type: Date
    },
    firstResponseAt: {
        type: Date
    },
    resolvedAt: {
        type: Date
    },
    closedAt: {
        type: Date
    },
    resolutionSummary: {
        type: String
    },
    rejectionReason: {
        type: String
    },
    evidenceImages: [{
        fileName: String,
        fileUrl: String,
        mimeType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: Date
    },
    tags: [String],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexing for faster queries
// ComplaintTicketSchema.index({ complaintCode: 1 }); // Removed redundant index (already unique: true)
ComplaintTicketSchema.index({ studentId: 1 });
ComplaintTicketSchema.index({ category: 1 });
ComplaintTicketSchema.index({ status: 1 });
ComplaintTicketSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('ComplaintTicket', ComplaintTicketSchema);
