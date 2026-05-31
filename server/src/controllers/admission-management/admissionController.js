const AdmissionApplication = require('../../models/admission-management/AdmissionApplication');
const User = require('../../models/auth/User');
const { buildFileMeta } = require('../../middlewares/upload/uploadMiddleware');
const { createNotification } = require('../notificationController');

// ─── Helper: build profilePhotoUrl and uploadedDocuments from req.files ───────
const extractFileUpdates = (files = {}) => {
  const updates = {};

  // Profile photo → stored as a SERVER-RELATIVE PATH so all frontends can prepend their own base URL
  // e.g. '/uploads/profile-photos/profilePhoto-123.jpg'
  // Frontend usage: `${API}${profilePhotoUrl}` = 'http://localhost:5000/uploads/profile-photos/...'
  if (files.profilePhoto && files.profilePhoto[0]) {
    updates.profilePhotoUrl = `/uploads/profile-photos/${files.profilePhoto[0].filename}`;
  }

  // Admission documents → stored as metadata objects
  const docFields = [
    'tenthMarksheet', 'twelfthMarksheet', 'transferCertificate',
    'migrationCertificate', 'casteCertificate', 'incomeCertificate',
    'passportPhoto', 'idProof', 'domicileCertificate',
    'entranceScorecard', 'disabilityCertificate'
  ];

  const docUpdates = {};
  docFields.forEach(field => {
    if (files[field] && files[field][0]) {
      docUpdates[field] = buildFileMeta(files[field][0], 'admission-documents');
    }
  });

  if (Object.keys(docUpdates).length > 0) {
    updates.uploadedDocuments = docUpdates;
  }

  return updates;
};

// ─── Helper: safely parse multipart or JSON body sections ────────────────────
const parseBodySection = (body, key) => {
  const raw = body[key];
  if (!raw) return undefined;
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch { return undefined; }
};

// @desc    Get current student's own admission application
// @route   GET /api/admissions/me
// @access  Private/Student
exports.getOwnApplication = async (req, res) => {
  try {
    let application = await AdmissionApplication.findOne({ linkedUserId: req.user._id });
    
    if (!application) {
      // Auto-create a skeleton draft so the student has an Application ID immediately
      const newAppId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      application = await AdmissionApplication.create({
        applicationId: newAppId,
        linkedUserId: req.user._id,
        applicationStatus: 'draft',
        personalDetails: { email: req.user.email },
        addressDetails: {
          current: { addressLine1: '', city: '', state: '', pincode: '' },
          permanent: { addressLine1: '', city: '', state: '', pincode: '' }
        },
        academicDetails: {},
        courseSelection: {},
        guardianDetails: {}
      });
    }
    // Deep ownership enforcement
    if (application.linkedUserId.toString() !== req.user._id.toString()) {
       return res.status(403).json({ success: false, error: 'Unauthorized data access attempt' });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error('[GE_OWN_APP_ERROR]', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create or Update Draft Application
// @route   POST /api/admissions
// @route   PUT /api/admissions/draft
// @access  Private/Student
exports.createOrUpdateDraft = async (req, res) => {
  try {
    // Support both JSON body and multipart/form-data.
    // When using FormData, each form section is sent as a JSON-stringified string field.
    const personalDetails   = parseBodySection(req.body, 'personalDetails');
    const addressDetails    = parseBodySection(req.body, 'addressDetails');
    const academicDetails   = parseBodySection(req.body, 'academicDetails');
    const courseSelection   = parseBodySection(req.body, 'courseSelection');
    const guardianDetails   = parseBodySection(req.body, 'guardianDetails');

    // Extract file updates from uploaded files
    const fileUpdates = extractFileUpdates(req.files || {});

    // Strip profilePhotoUrl from the parsed JSON body — it must ONLY come from
    // an actual file upload (req.files) or the existing DB record.
    // This prevents overwriting a saved photo when the student saves the text form fields.
    const { profilePhotoUrl: _ignored, ...cleanPersonalDetails } = personalDetails || {};

    let application = await AdmissionApplication.findOne({ linkedUserId: req.user._id });

    if (application) {
      if (!['draft', 'reupload_requested'].includes(application.applicationStatus)) {
        return res.status(400).json({
          success: false,
          error: `Cannot modify application in ${application.applicationStatus} status`
        });
      }

      // ── Build $set payload using dot-notation for personalDetails fields ──────
      const updatePayload = {};

      if (personalDetails) {
        Object.entries(cleanPersonalDetails).forEach(([key, val]) => {
          updatePayload[`personalDetails.${key}`] = val;
        });
      }

      if (fileUpdates.profilePhotoUrl) {
        updatePayload['personalDetails.profilePhotoUrl'] = fileUpdates.profilePhotoUrl;
      }

      if (addressDetails)  updatePayload.addressDetails  = addressDetails;
      if (academicDetails) updatePayload.academicDetails = academicDetails;
      if (courseSelection) updatePayload.courseSelection = courseSelection;
      if (guardianDetails) updatePayload.guardianDetails = guardianDetails;

      if (fileUpdates.uploadedDocuments) {
        Object.entries(fileUpdates.uploadedDocuments).forEach(([key, meta]) => {
          updatePayload[`uploadedDocuments.${key}`] = meta;
        });
      }

      application = await AdmissionApplication.findOneAndUpdate(
        { linkedUserId: req.user._id },
        { $set: updatePayload },
        { new: true, runValidators: false }
      );
    } else {
      // Create new draft
      const newAppId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const createPayload = {
        applicationId: newAppId,
        linkedUserId: req.user._id,
        applicationStatus: 'draft'
      };
      // personalDetails: use form fields + profilePhotoUrl from file upload (if any)
      if (personalDetails || fileUpdates.profilePhotoUrl) {
        createPayload.personalDetails = {
          ...cleanPersonalDetails,
          ...(fileUpdates.profilePhotoUrl ? { profilePhotoUrl: fileUpdates.profilePhotoUrl } : {})
        };
      }
      if (addressDetails)  createPayload.addressDetails  = addressDetails;
      if (academicDetails) createPayload.academicDetails = academicDetails;
      if (courseSelection) createPayload.courseSelection = courseSelection;
      if (guardianDetails) createPayload.guardianDetails = guardianDetails;
      if (fileUpdates.uploadedDocuments) createPayload.uploadedDocuments = fileUpdates.uploadedDocuments;

      application = await AdmissionApplication.create(createPayload);
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Submit Student Application
// @route   POST /api/admissions/submit
// @access  Private/Student
exports.submitApplication = async (req, res) => {
  try {
    const application = await AdmissionApplication.findOne({ linkedUserId: req.user._id });
    if (!application) {
      return res.status(404).json({ success: false, error: 'Draft not found. Please save a draft first.' });
    }

    if (application.applicationStatus !== 'draft') {
      console.warn(`[Submit Rejected] User ${req.user.id} tried to submit application ${application._id} with status ${application.applicationStatus}`);
      return res.status(400).json({ success: false, error: 'Application is no longer in draft status.' });
    }

    application.applicationStatus = 'submitted';
    application.submittedAt = Date.now();
    await application.save();

    // Notify ALL admission staff
    const staff = await User.find({ role: 'admission_staff' });
    for (const s of staff) {
      await createNotification({
        recipient: s._id,
        actor: req.user.id,
        type: 'new_application',
        title: 'New Application Submitted',
        message: `A new application ${application.applicationId} has been submitted by ${application.personalDetails?.fullName || 'a student'}.`,
        relatedApplication: application._id
      });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error(`[Submit Fatal Error] User ${req.user.id}:`, error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Reupload requested documents/fields
// @route   PUT /api/admissions/reupload
// @access  Private/Student
exports.reuploadDocuments = async (req, res) => {
  try {
    let application = await AdmissionApplication.findOne({ linkedUserId: req.user._id });

    if (!application || application.applicationStatus !== 'reupload_requested') {
      return res.status(400).json({ success: false, error: 'Not eligible for re-upload' });
    }

    const fileUpdates = extractFileUpdates(req.files || {});

    // Only update fields that were requested for re-upload
    const updatePayload = {};
    if (fileUpdates.uploadedDocuments) {
      Object.entries(fileUpdates.uploadedDocuments).forEach(([key, meta]) => {
        if (application.requestedReuploadFields.includes(key)) {
          updatePayload[`uploadedDocuments.${key}`] = meta;
        }
      });
    }

    updatePayload.requestedReuploadFields = [];
    updatePayload.applicationStatus = 'under_review';

    application = await AdmissionApplication.findOneAndUpdate(
      { linkedUserId: req.user.id },
      { $set: updatePayload },
      { new: true }
    );

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==========================================
// STAFF & ADMIN ENDPOINTS
// ==========================================

// @desc    Get all applications
// @route   GET /api/admissions
// @access  Private/Admin/Staff
exports.getAllApplications = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.applicationStatus = req.query.status;
    
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      
      const User = require('../../models/auth/User');
      const matchingUsers = await User.find({
        $or: [{ fullName: regex }, { email: regex }]
      }).select('_id');
      const userIds = matchingUsers.map(u => u._id);

      filter.$or = [
        { applicationId: regex },
        { linkedUserId: { $in: userIds } }
      ];
    }
    
    if (req.query.department) {
      filter['courseSelection.department'] = req.query.department;
    }

    const sort = req.query.sort === 'oldest' ? 'createdAt' : '-createdAt';
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const applications = await AdmissionApplication.find(filter)
        .populate('linkedUserId', 'fullName email')
        .sort(sort)
        .skip(skip)
        .limit(limit);
        
    const total = await AdmissionApplication.countDocuments(filter);
        
    res.status(200).json({ 
      success: true, 
      count: applications.length, 
      total,
      page,
      pages: Math.ceil(total / limit),
      data: applications 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single application by ID
// @route   GET /api/admissions/:id
// @access  Private/Admin/Staff
exports.getApplicationById = async (req, res) => {
  try {
    const application = await AdmissionApplication.findById(req.params.id)
        .populate('linkedUserId', 'fullName email')
        .populate('adminComments.addedBy', 'fullName role');

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Review Application (Add comments / mark review state)
// @route   PUT /api/admissions/:id/review
// @access  Private/Admin/Staff
exports.reviewApplication = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const application = await AdmissionApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (status && ['under_review', 'pending_clarification'].includes(status)) {
       application.applicationStatus = status;
       application.reviewedBy = req.user.id;
    }

    if (comment) {
       application.adminComments.push({
           comment,
           addedBy: req.user.id
       });
    }

    await application.save();

    // Notify student
    if (status) {
      await createNotification({
        recipient: application.linkedUserId,
        actor: req.user.id,
        type: 'status_update',
        title: 'Application Status Updated',
        message: `Your application status has been updated to ${status.replace('_', ' ')}.`,
        relatedApplication: application._id
      });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Request Re-upload of documents/fields
// @route   PUT /api/admissions/:id/request-reupload
// @access  Private/Admin/Staff
exports.requestReupload = async (req, res) => {
  try {
    const { fields, comment } = req.body;
    const application = await AdmissionApplication.findById(req.params.id);

    if (!application) return res.status(404).json({ success: false, error: 'Not found' });

    application.applicationStatus = 'reupload_requested';
    application.requestedReuploadFields = fields;
    
    if (comment) {
       application.adminComments.push({ comment, addedBy: req.user.id });
    }

    await application.save();

    // Notify student
    await createNotification({
      recipient: application.linkedUserId,
      actor: req.user.id,
      type: 'reupload_requested',
      title: 'Re-upload Requested',
      message: `Correction requested for following fields: ${fields.join(', ')}. Please update your application.`,
      relatedApplication: application._id
    });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Reject Application
// @route   PUT /api/admissions/:id/reject
// @access  Private/Admin/Staff
exports.rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;
    const application = await AdmissionApplication.findById(req.params.id);

    if (!application) return res.status(404).json({ success: false, error: 'Not found' });

    application.applicationStatus = 'rejected';
    application.rejectionReason = reason || 'Rejected without reason provided.';
    application.reviewedBy = req.user.id;

    await application.save();
    console.log(`[Submit Success] App: ${application._id} submitted by User: ${req.user.id}`);
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Approve Application
// @route   PUT /api/admissions/:id/approve
// @access  Private/Admin/Staff
exports.approveApplication = async (req, res) => {
  try {
    const application = await AdmissionApplication.findById(req.params.id);

    if (!application) return res.status(404).json({ success: false, error: 'Not found' });

    application.applicationStatus = 'approved';
    application.approvedAt = Date.now();
    application.reviewedBy = req.user._id;

    await application.save();

    // MODULE 2 INTEGRATION HOOK
    // Automatically generate the Central Student Master Record for the approved candidate
    const StudentMaster = require('../../models/student-master/StudentMaster');
    const existingMaster = await StudentMaster.findOne({ userId: application.linkedUserId });
    
    if (!existingMaster) {
      // Use the stored admissionYear if available, otherwise fallback to current year
      const admissionYear = application.admissionYear || new Date().getFullYear();
      const randomPart = Math.floor(1000 + Math.random() * 9000); 
      const newStudentId = `STU-${admissionYear}-${randomPart}`;

      // Logic: If they applied for First Year (Sem 1/2 equivalents) or no dept yet, 
      // they should belong to Common Engineering initially for FE sections.
      const admissionDept = application.courseSelection?.department;
      const finalDept = admissionDept || 'Common Engineering';

      await StudentMaster.create({
        userId: application.linkedUserId,
        admissionId: application._id,
        studentId: newStudentId,
        enrollmentStatus: 'active',
        academicProfile: {
          department: finalDept,
          course: application.courseSelection?.course || 'B.Tech - First Year',
          specialization: application.courseSelection?.specialization || 'General',
          batch: `${admissionYear}-${Number(admissionYear) + 4}`,
          currentSemester: 1
        },
        personalDetails: {
          fullName: application.personalDetails?.fullName || 'New Student',
          dateOfBirth: application.personalDetails?.dateOfBirth,
          gender: application.personalDetails?.gender,
          bloodGroup: application.personalDetails?.bloodGroup,
          profilePhotoUrl: application.personalDetails?.profilePhotoUrl
        },
        contactDetails: {
          email: application.personalDetails?.email,
          mobileNumber: application.personalDetails?.mobileNumber,
          emergencyContact: application.guardianDetails?.emergencyContactPhone
        },
        uploadedDocuments: application.uploadedDocuments || {},
        history: [{
          action: 'AUTOMATIC_ONBOARDING',
          changedBy: req.user._id,
          details: { note: 'Record created via Admission Approval integration' }
        }]
      });
      console.log(`[StudentMaster Created] StudentID: ${newStudentId} for User: ${application.linkedUserId}`);
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error(`[Approve Fatal Error] App ${req.params.id} by Staff ${req.user._id}:`, error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ─── Helper: sanitize a name part into a clean lowercase slug ─────────────────
const sanitizeNamePart = (str = '') =>
  str.toLowerCase().replace(/[^a-z0-9]/g, '');

// @desc    Create new applicant account Before Admission
// @route   POST /api/admissions/create-applicant
// @access  Private/Admin/Staff
exports.createApplicantAccount = async (req, res) => {
  try {
    const { firstName, lastName, year, username, password, mobileNumber } = req.body;

    if (!firstName || !lastName || !year || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide first name, last name, year, and a temporary password.'
      });
    }

    const yearStr = String(year).trim();
    if (!/^\d{4}$/.test(yearStr)) {
      return res.status(400).json({ success: false, error: 'Year must be a valid 4-digit year.' });
    }

    const User = require('../../models/auth/User');

    // Build base email from sanitised name parts + year
    const baseLocal = `${sanitizeNamePart(firstName)}${sanitizeNamePart(lastName)}${yearStr}`;
    if (!baseLocal) {
      return res.status(400).json({ success: false, error: 'Invalid name: cannot generate a valid email.' });
    }

    // Find a unique @erpsaa.com email (try base, then base1, base2, … base9)
    let generatedEmail = `${baseLocal}@erpsaa.com`;
    let attempt = 0;
    while (await User.findOne({ email: generatedEmail })) {
      attempt++;
      if (attempt > 9) {
        return res.status(400).json({
          success: false,
          error: 'Could not generate a unique email for this student. Please try a different name or year.'
        });
      }
      generatedEmail = `${baseLocal}${attempt}@erpsaa.com`;
    }

    // Hard-enforce @erpsaa.com (guards against any unexpected bypass)
    if (!generatedEmail.endsWith('@erpsaa.com')) {
      return res.status(400).json({ success: false, error: 'Only @erpsaa.com email addresses are allowed for student accounts.' });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    if (username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ success: false, error: 'A user with this username already exists.' });
      }
    }

    if (!mobileNumber) {
      return res.status(400).json({ success: false, error: 'WhatsApp mobile number is required to send the verification OTP.' });
    }

    // --- WHATSAPP OTP INTEGRATION ---
    const PendingUser = require('../../models/auth/PendingUser');
    const whatsappService = require('../../services/whatsappService');

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000);

    // Save to temporary storage
    await PendingUser.create({
      fullName,
      email: generatedEmail,
      password, // Password will be hashed in the User pre-save hook when verified
      phone: mobileNumber,
      role: 'student',
      otherData: {
        year: yearStr,
        username,
        staffId: req.user.id
      },
      otp,
      otpExpire
    });

    // Send OTP to student
    await whatsappService.sendOTP(mobileNumber, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent to student WhatsApp',
      phone: mobileNumber,
      tempPassword: password
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get stats for review queue dashboard
// @route   GET /api/admissions/queue-stats
// @access  Private/Admin/Staff
exports.getReviewQueueStats = async (req, res) => {
  try {
    const stats = await AdmissionApplication.aggregate([
      {
        $group: {
          _id: null,
          totalSubmitted: { 
            $sum: { $cond: [{ $ne: ['$applicationStatus', 'draft'] }, 1, 0] } 
          },
          underReview: { 
            $sum: { $cond: [{ $eq: ['$applicationStatus', 'under_review'] }, 1, 0] } 
          },
          reuploadRequested: { 
            $sum: { $cond: [{ $eq: ['$applicationStatus', 'reupload_requested'] }, 1, 0] } 
          },
          pendingClarification: { 
            $sum: { $cond: [{ $eq: ['$applicationStatus', 'pending_clarification'] }, 1, 0] } 
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalSubmitted: 0,
        underReview: 0,
        reuploadRequested: 0,
        pendingClarification: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
