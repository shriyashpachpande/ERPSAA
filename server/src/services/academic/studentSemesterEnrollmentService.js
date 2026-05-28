const StudentSemesterEnrollment = require('../../models/academic/StudentSemesterEnrollment');
const StudentMaster = require('../../models/student-master/StudentMaster');
const mongoose = require('mongoose');

exports.getEligibleStudents = async (filters = {}, currentUser) => {
  const query = { enrollmentStatus: 'active' };

  // 1. Resolve role-based department restrictions
  let targetDepartment = filters.department && filters.department !== 'All' ? filters.department : null;

  if (currentUser && currentUser.role === 'hod') {
    // If user is HOD, they can ONLY see students from their own department
    targetDepartment = currentUser.department || 'IT';
  }

  // Normalize department (Resolve code to name)
  let deptMatchCriteria = null;
  if (targetDepartment) {
    const Department = mongoose.model('Department');
    const deptInfo = await Department.findOne({
      $or: [
        { code: targetDepartment.toUpperCase() },
        { name: { $regex: new RegExp(`^${targetDepartment}$`, 'i') } }
      ]
    });

    if (deptInfo) {
      deptMatchCriteria = {
        $or: [
          { 'academicProfile.department': { $regex: new RegExp(`${deptInfo.name}`, 'i') } },
          { 'academicProfile.department': { $regex: new RegExp(`^${deptInfo.code}$`, 'i') } }
        ]
      };
    } else {
      deptMatchCriteria = { 'academicProfile.department': { $regex: new RegExp(`${targetDepartment}`, 'i') } };
    }
  }

  // 2. Apply department filter
  if (deptMatchCriteria && !filters.search) {
    // If it's a simple match (no $or), we can just set it
    if (deptMatchCriteria['academicProfile.department']) {
      query['academicProfile.department'] = deptMatchCriteria['academicProfile.department'];
    } else {
      // It's an $or, so we need to use $and if query already has fields, or just merge
      query.$and = [deptMatchCriteria];
    }
  }

  if (filters.search) {
    const regex = { $regex: filters.search, $options: 'i' };
    const searchConditions = [
      { studentId: regex },
      { 'personalDetails.fullName': regex },
      { 'contactDetails.email': regex }
    ];

    // If targetDepartment is set (e.g. HOD), ensure search results are also within that department
    if (deptMatchCriteria) {
      query.$and = query.$and || [];
      query.$and.push(deptMatchCriteria);
      query.$and.push({ $or: searchConditions });
    } else {
      query.$or = searchConditions;
    }
  }

  return await StudentMaster.find(query)
    .populate('userId', 'fullName email')
    .select('studentId personalDetails academicProfile contactDetails')
    .limit(500000);
};

exports.enrollStudent = async (data, userId) => {
  // Check if an enrollment already exists for this student in this academic year and semester
  const existingEnrollment = await StudentSemesterEnrollment.findOne({
    studentMasterId: data.studentMasterId,
    academicYearId: data.academicYearId,
    semesterId: data.semesterId
  });

  let enrollment;
  if (existingEnrollment) {
    // Update existing enrollment details
    existingEnrollment.sectionId = data.sectionId;
    existingEnrollment.enrollmentStatus = data.enrollmentStatus || existingEnrollment.enrollmentStatus;
    existingEnrollment.remarks = data.remarks || existingEnrollment.remarks;
    existingEnrollment.updatedBy = userId;
    enrollment = await existingEnrollment.save();
  } else {
    // Create new enrollment
    enrollment = await StudentSemesterEnrollment.create({ ...data, createdBy: userId });
  }

  // Soft update StudentMaster to reflect new academic state
  await StudentMaster.findByIdAndUpdate(data.studentMasterId, {
    'academicProfile.currentSemester': (await StudentSemesterEnrollment.countDocuments({ studentMasterId: data.studentMasterId }))
  });

  return enrollment;
};

const FacultyProfile = require('../../models/academic/FacultyProfile');

exports.getEnrollments = async (filters = {}, currentUser) => {
  let query = {};

  // 1. Resolve role-based department restrictions
  let targetDepartment = filters.department && filters.department !== 'All' ? filters.department : null;

  if (currentUser && currentUser.role === 'hod') {
    // Use department attached to user by authMiddleware
    targetDepartment = currentUser.department || 'IT';
  }

  // Normalize department (Resolve code to name)
  let deptMatchCriteria = null;
  if (targetDepartment) {
    const Department = mongoose.model('Department');
    const deptInfo = await Department.findOne({
      $or: [
        { code: targetDepartment.toUpperCase() },
        { name: { $regex: new RegExp(`^${targetDepartment}$`, 'i') } }
      ]
    });

    if (deptInfo) {
      deptMatchCriteria = {
        $or: [
          { 'academicProfile.department': { $regex: new RegExp(`^${deptInfo.name}$`, 'i') } },
          { 'academicProfile.department': { $regex: new RegExp(`^${deptInfo.code}$`, 'i') } }
        ]
      };
    } else {
      deptMatchCriteria = { 'academicProfile.department': { $regex: new RegExp(`^${targetDepartment}$`, 'i') } };
    }
  }

  // 2. Build StudentMaster filter (Search + Department)
  const smFilter = {};
  if (deptMatchCriteria) {
    if (deptMatchCriteria['academicProfile.department']) {
      smFilter['academicProfile.department'] = deptMatchCriteria['academicProfile.department'];
    } else {
      smFilter.$and = [deptMatchCriteria];
    }
  }

  if (filters.search) {
    const regex = { $regex: filters.search, $options: 'i' };
    const searchConditions = [
      { studentId: regex },
      { 'personalDetails.fullName': regex }
    ];

    if (smFilter.$and) {
      smFilter.$and.push({ $or: searchConditions });
    } else if (smFilter['academicProfile.department']) {
      const deptFilter = { 'academicProfile.department': smFilter['academicProfile.department'] };
      delete smFilter['academicProfile.department'];
      smFilter.$and = [deptFilter, { $or: searchConditions }];
    } else {
      smFilter.$or = searchConditions;
    }
  }

  // 3. Find eligible student master IDs
  const students = await StudentMaster.find(smFilter).select('_id');
  const studentMasterIds = students.map(s => s._id);

  // 4. Build Enrollment query
  query.studentMasterId = { $in: studentMasterIds };

  if (filters.academicYearId) query.academicYearId = filters.academicYearId;
  if (filters.semesterId) query.semesterId = filters.semesterId;
  if (filters.sectionId) query.sectionId = filters.sectionId;
  if (filters.status) query.enrollmentStatus = filters.status;

  const enrollments = await StudentSemesterEnrollment.find(query)
    .populate({
      path: 'studentMasterId',
      select: 'studentId personalDetails academicProfile',
      populate: { path: 'userId', select: 'fullName' }
    })
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterName semesterNumber')
    .populate('sectionId', 'name')
    .sort({ createdAt: 1 });

  return enrollments;
};

exports.getEnrollmentById = async (id, currentUser) => {
  const enrollment = await StudentSemesterEnrollment.findById(id)
    .populate({
      path: 'studentMasterId',
      select: 'studentId personalDetails academicProfile',
      populate: { path: 'userId', select: 'fullName' }
    })
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterName semesterNumber')
    .populate('sectionId', 'name');

  // RBAC Check for HOD
  if (currentUser && currentUser.role === 'hod' && enrollment) {
    const Department = mongoose.model('Department');
    const hodDeptInfo = await Department.findOne({
      $or: [
        { code: currentUser.department?.toUpperCase() || 'IT' },
        { name: { $regex: new RegExp(`^${currentUser.department}$`, 'i') } }
      ]
    });

    let allowedDepartments = [currentUser.department?.toUpperCase() || 'IT'];
    if (hodDeptInfo) {
      allowedDepartments.push(hodDeptInfo.name.toUpperCase());
      allowedDepartments.push(hodDeptInfo.code.toUpperCase());
    }

    const studentDept = enrollment.studentMasterId.academicProfile.department?.toUpperCase();
    if (!allowedDepartments.includes(studentDept)) {
      throw new Error('Access denied: Student does not belong to your department');
    }
  }

  return enrollment;
};

exports.updateEnrollment = async (id, data, userId) => {
  return await StudentSemesterEnrollment.findByIdAndUpdate(id, { ...data, updatedBy: userId }, { new: true });
};

exports.getStudentAcademicProfile = async (studentMasterId, currentUser) => {
  const sm = await StudentMaster.findById(studentMasterId)
    .populate('userId', 'fullName email')
    .populate('admissionId', 'applicationId approvedAt');

  if (!sm) {
    throw new Error('Student profile not found');
  }

  // RBAC Check for HOD
  if (currentUser && currentUser.role === 'hod') {
    const Department = mongoose.model('Department');
    const hodDeptInfo = await Department.findOne({
      $or: [
        { code: currentUser.department?.toUpperCase() || 'IT' },
        { name: { $regex: new RegExp(`^${currentUser.department}$`, 'i') } }
      ]
    });

    let allowedDepartments = [currentUser.department?.toUpperCase() || 'IT'];
    if (hodDeptInfo) {
      allowedDepartments.push(hodDeptInfo.name.toUpperCase());
      allowedDepartments.push(hodDeptInfo.code.toUpperCase());
    }

    const studentDept = sm.academicProfile.department?.toUpperCase();
    if (!allowedDepartments.includes(studentDept)) {
      throw new Error('Access denied: Student does not belong to your department');
    }
  }

  const currentEnrollment = await StudentSemesterEnrollment.findOne({ studentMasterId })
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterName semesterNumber')
    .populate('sectionId', 'name department academicYearId semesterId')
    .sort({ createdAt: -1 });

  return {
    studentMaster: sm,
    currentEnrollment
  };
};
