const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const generateComplaintTicketCode = require('../../modules/complaint-management/generateComplaintTicketCodeService');
const calculateSlaDeadline = require('../../modules/complaint-management/calculateComplaintSlaDeadlineService');
const autoAssignHandler = require('../../modules/complaint-management/autoAssignComplaintHandlerService');
const createAuditEntry = require('../../modules/complaint-management/createComplaintAuditEntryService');
const uploadEvidenceImage = require('../../modules/complaint-management/uploadComplaintEvidenceImageService');
const { validateCreateComplaint } = require('../../validators/complaint-management/createComplaintRequestValidator');
const { COMPLAINT_STATUS } = require('../../constants/complaint-management/complaintStatusConstants');
const mapCategoryToRouting = require('../../modules/complaint-management/mapComplaintCategoryToDepartmentService');

/**
 * @desc    Create a new student complaint
 * @route   POST /api/complaints/create
 * @access  Private (Student)
 */
const createStudentComplaint = async (req, res, next) => {
    try {
        const { isValid, errors } = validateCreateComplaint(req.body);
        if (!isValid) {
            return res.status(400).json({ success: false, errors });
        }

        const ticketCode = generateComplaintTicketCode();
        const slaDeadline = calculateSlaDeadline(req.body.priority, req.body.category);
        const routing = mapCategoryToRouting(req.body.category);
        const { handlerId, assignedRole } = await autoAssignHandler(req.body.category, req.user.department);

        const evidenceImages = [];
        if (req.file) {
            const imageMeta = uploadEvidenceImage(req.file);
            if (imageMeta) evidenceImages.push(imageMeta);
        } else if (req.files && req.files.length > 0) {
           req.files.forEach(file => {
               const meta = uploadEvidenceImage(file);
               if (meta) evidenceImages.push(meta);
           });
        }

        const complaint = await ComplaintTicket.create({
            ...req.body,
            complaintCode: ticketCode,
            studentId: req.user._id,
            studentSnapshot: {
                fullName: req.user.fullName,
                email: req.user.email,
                department: req.user.department,
                section: req.user.section,
                rollNumber: req.user.rollNumber
            },
            dueAt: slaDeadline,
            assignedTo: handlerId,
            assignedRole: assignedRole,
            departmentRoute: routing.departmentRoute,
            evidenceImages,
            createdBy: req.user._id,
            status: COMPLAINT_STATUS.SUBMITTED
        });

        await createAuditEntry({
            complaintId: complaint._id,
            action: 'CREATE',
            newStatus: COMPLAINT_STATUS.SUBMITTED,
            performedBy: req.user._id,
            performedByRole: req.user.role,
            remarks: 'Complaint raised by student'
        });

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (err) {
        next(err);
    }
};

module.exports = createStudentComplaint;
