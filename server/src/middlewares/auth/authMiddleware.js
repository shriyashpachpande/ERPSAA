const jwt = require('jsonwebtoken');
const User = require('../../models/auth/User');
const mongoose = require('mongoose');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User associated with token not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, error: 'User is deactivated' });
    }

    // Convert to plain object to allow attaching extra fields, ensuring virtuals like 'id' are kept
    req.user = user.toObject({ virtuals: true });
    
    // Attach department/designation for HOD/Faculty
    const FacultyProfile = mongoose.model('FacultyProfile');
    if (req.user.role === 'hod' || req.user.role === 'faculty') {
      const profile = await FacultyProfile.findOne({ user: req.user._id });
      if (profile) {
        req.user.department = profile.department;
        req.user.designation = profile.designation;
      }
    }

    // Attach studentMasterId for Students
    if (req.user.role === 'student') {
      const StudentMaster = mongoose.model('StudentMaster');
      const student = await StudentMaster.findOne({ userId: req.user._id });
      if (student) {
        req.user.studentMasterId = student._id;
      }
    }

    // Centralized HOD flag for backend security checks
    req.user.isHOD = 
      req.user.role === 'hod' || 
      (req.user.designation && (
        req.user.designation === 'Head of Department' || 
        req.user.designation === 'HOD'
      ));

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};
