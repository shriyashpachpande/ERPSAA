const User = require('../../models/auth/User');
const FacultyProfile = require('../../models/academic/FacultyProfile');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, error: 'Account is deactivated. Contact Admin.' });
    }

    let userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword
    };

    if (user.role === 'hod' || user.role === 'faculty') {
      const profile = await FacultyProfile.findOne({ user: user._id });
      if (profile) {
        userResponse.department = profile.department;
        userResponse.designation = profile.designation;
      }
    }

    userResponse.isHOD = 
      userResponse.role === 'hod' || 
      (userResponse.designation && (
        userResponse.designation === 'Head of Department' || 
        userResponse.designation === 'HOD'
      ));

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // req.user is already populated and hardened by protect middleware
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User context not found' });
    }
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/details
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      fullName: req.body.fullName,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user._id || req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, error: 'Password is incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password via WhatsApp OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const User = require('../../models/auth/User');
    const PendingPasswordReset = require('../../models/auth/PendingPasswordReset');
    const whatsappService = require('../../services/whatsappService');

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'There is no user with that email' });
    }

    // Find WhatsApp mobile number
    let mobileNumber = null;

    // Check StudentMaster
    const StudentMaster = require('../../models/student-master/StudentMaster');
    const studentMaster = await StudentMaster.findOne({ userId: user._id });
    if (studentMaster && studentMaster.contactDetails && studentMaster.contactDetails.mobileNumber) {
      mobileNumber = studentMaster.contactDetails.mobileNumber;
    }

    if (!mobileNumber) {
      // Check AdmissionApplication
      const AdmissionApplication = require('../../models/admission-management/AdmissionApplication');
      const admissionApp = await AdmissionApplication.findOne({ linkedUserId: user._id });
      if (admissionApp && admissionApp.personalDetails && admissionApp.personalDetails.mobileNumber) {
        mobileNumber = admissionApp.personalDetails.mobileNumber;
      }
    }

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        error: 'No registered WhatsApp mobile number found for this account. Please contact administrative staff.'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000);

    // Save/Update pending password reset record
    await PendingPasswordReset.findOneAndUpdate(
      { email },
      {
        userId: user._id,
        email,
        phone: mobileNumber,
        otp,
        otpExpire
      },
      { upsert: true, new: true }
    );

    // Send OTP to user's registered WhatsApp
    const message = `*ERPSAA Security Access*\n\nYour OTP for password recovery is: *${otp}*\n\nIf you did not request this, please ignore this message.`;
    await whatsappService.sendMessage(mobileNumber, message);

    // Mask phone number for secure response preview (e.g. ******5678)
    const maskedPhone = mobileNumber.length >= 10
      ? '******' + mobileNumber.slice(-4)
      : mobileNumber;

    res.status(200).json({
      success: true,
      message: 'OTP sent to your registered WhatsApp mobile number.',
      phone: maskedPhone
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify WhatsApp Reset OTP and change password
// @route   POST /api/auth/reset-password/verify
// @access  Public
exports.verifyResetOTPAndPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const PendingPasswordReset = require('../../models/auth/PendingPasswordReset');
    const User = require('../../models/auth/User');

    const pendingReset = await PendingPasswordReset.findOne({ email, otp });

    if (!pendingReset || pendingReset.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    const user = await User.findById(pendingReset.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User no longer exists' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete the pending reset record
    await PendingPasswordReset.deleteOne({ _id: pendingReset._id });

    // Send Success Notification via WhatsApp
    const whatsappService = require('../../services/whatsappService');
    await whatsappService.sendMessage(
      pendingReset.phone,
      `*ERPSAA Security Notification*\n\nHello *${user.fullName}*,\n\nYour account password was successfully reset just now.\n\nIf you did not perform this action, please contact administrative support immediately.`
    );

    res.status(200).json({
      success: true,
      message: 'Password reset successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify WhatsApp OTP and register the user
// @route   POST /api/auth/register/verify
// @access  Public
exports.verifyAndRegister = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    const PendingUser = require('../../models/auth/PendingUser');
    const User = require('../../models/auth/User');
    const AdmissionApplication = require('../../models/admission-management/AdmissionApplication');
    const whatsappService = require('../../services/whatsappService');

    const pendingUser = await PendingUser.findOne({ phone, otp });

    if (!pendingUser || pendingUser.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // --- REPLICATING ORIGINAL CREATION LOGIC ---
    const user = await User.create({
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      username: pendingUser.otherData?.username || undefined,
      password: pendingUser.password, // This gets hashed by User model pre-save hook
      role: pendingUser.role,
      isActive: true,
      mustChangePassword: true,
      createdBy: pendingUser.otherData?.staffId
    });

    // Create Admission Application exactly as original code
    const newAppId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await AdmissionApplication.create({
      applicationId: newAppId,
      linkedUserId: user._id,
      admissionYear: Number(pendingUser.otherData?.year),
      applicationStatus: 'draft',
      personalDetails: { 
        fullName: user.fullName,
        email: user.email,
        mobileNumber: pendingUser.phone
      },
      addressDetails: {
        current: { addressLine1: '', city: '', state: '', pincode: '' },
        permanent: { addressLine1: '', city: '', state: '', pincode: '' }
      },
      academicDetails: {},
      courseSelection: {},
      guardianDetails: {}
    });

    // Delete pending record
    await PendingUser.deleteOne({ _id: pendingUser._id });

    // Send Success Notification via WhatsApp
    await whatsappService.sendSuccessNotification(pendingUser.phone, user.fullName, user.email);

    res.status(201).json({
      success: true,
      message: 'Account verified and created successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
