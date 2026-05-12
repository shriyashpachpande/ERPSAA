const User = require('../../models/auth/User');
const FacultyProfile = require('../../models/academic/FacultyProfile');
const FacultyAcademicAssignment = require('../../models/academic/FacultyAcademicAssignment');
const AcademicTimetableEntry = require('../../models/academic/AcademicTimetableEntry');
const InternalMarksRecord = require('../../models/academic/InternalMarksRecord');
const crypto = require('crypto');

/**
 * Generate a unique ERP email based on first and last name
 */
const generateUniqueERPEmail = async (firstName, lastName) => {
  const sanitize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = `${sanitize(firstName)}.${sanitize(lastName)}`;
  
  let email = `${base}@erpsaa.com`;
  let exists = await User.findOne({ email });
  let counter = 1;

  while (exists) {
    email = `${base}${counter}@erpsaa.com`;
    exists = await User.findOne({ email });
    counter++;
  }

  return email;
};

/**
 * Generate a secure temporary password
 */
const generateTempPassword = () => {
  return crypto.randomBytes(4).toString('hex'); // 8 character hex string
};

/**
 * Create a new Faculty account and profile
 */
exports.registerFaculty = async (facultyData, creatorId) => {
  const { fullName, personalEmail, phone, department, designation, joiningDate, employeeId } = facultyData;

  // 1. Generate ERP credentials
  const names = fullName.trim().split(' ');
  const firstName = names[0];
  const lastName = names.length > 1 ? names[names.length - 1] : '';
  
  const erpEmail = await generateUniqueERPEmail(firstName, lastName);
  const tempPassword = generateTempPassword();

  // 2. Create Auth User
  // Map designation to appropriate runtime role
  const role = (designation === 'Head of Department') ? 'hod' : 'faculty';

  const user = await User.create({
    fullName,
    email: erpEmail,
    password: tempPassword,
    role,
    isActive: true,
    mustChangePassword: true,
    createdBy: creatorId
  });

  // 3. Create Faculty Profile
  const profile = await FacultyProfile.create({
    user: user._id,
    employeeId,
    department,
    designation,
    phone,
    personalEmail,
    erpEmail,
    joiningDate,
    status: 'active',
    createdBy: creatorId
  });

  return {
    user,
    profile,
    tempPassword // Returned once for display at creation
  };
};

/**
 * Get all faculty with populated user data
 */
exports.getAllFaculty = async (filters = {}) => {
  return await FacultyProfile.find(filters).populate('user', 'fullName role isActive');
};

/**
 * Get single faculty by ID
 */
exports.getFacultyById = async (id) => {
  return await FacultyProfile.findById(id).populate('user', 'fullName role isActive');
};

/**
 * Toggle faculty status
 */
exports.updateFacultyStatus = async (id, status) => {
  const profile = await FacultyProfile.findByIdAndUpdate(id, { status }, { new: true });
  if (!profile) throw new Error('Faculty not found');
  
  // Also update linked user activity
  await User.findByIdAndUpdate(profile.user, { isActive: status === 'active' });
  
  return profile;
};

/**
 * Delete or Soft-Delete Faculty conditionally
 */
exports.deleteFaculty = async (id) => {
  const profile = await FacultyProfile.findById(id);
  if (!profile) throw new Error('Faculty not found');

  // Verify external academic dependencies
  const hasAssignment = await FacultyAcademicAssignment.exists({ faculty: id });
  const hasTimetable = await AcademicTimetableEntry.exists({ facultyId: id });
  const hasMarks = await InternalMarksRecord.exists({ facultyProfileId: id });

  if (hasAssignment || hasTimetable || hasMarks) {
    // Soft-delete mechanism: Record locked
    profile.status = 'inactive';
    await profile.save();
    await User.findByIdAndUpdate(profile.user, { isActive: false });

    return {
      hardDeleted: false,
      profile,
      message: 'This faculty cannot be permanently deleted because it is already linked to academic records. The record has been safely marked inactive instead.'
    };
  } else {
    // Safely purged
    await User.findByIdAndDelete(profile.user);
    await FacultyProfile.findByIdAndDelete(id);

    return {
      hardDeleted: true,
      profile: null,
      message: 'Faculty record has been permanently deleted.'
    };
  }
};
