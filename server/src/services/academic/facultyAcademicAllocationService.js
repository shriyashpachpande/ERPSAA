const FacultyAcademicAssignment = require('../../models/academic/FacultyAcademicAssignment');

exports.createAllocation = async (data, userId) => {
  return await FacultyAcademicAssignment.create({ ...data, createdBy: userId });
};

exports.getAllocations = async (filters = {}) => {
  const query = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      query[key] = value;
    }
  }

  return await FacultyAcademicAssignment.find(query)
    .populate({
      path: 'faculty',
      populate: { path: 'user', select: 'fullName' }
    })
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterName semesterNumber')
    .populate('sectionId', 'name')
    .populate('subjectId', 'subjectName subjectCode')
    .sort({ createdAt: -1 });
};

exports.getAllocationById = async (id) => {
  return await FacultyAcademicAssignment.findById(id)
    .populate('faculty')
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterName')
    .populate('sectionId', 'name')
    .populate('subjectId', 'subjectName subjectCode');
};

exports.updateAllocation = async (id, data, userId) => {
  return await FacultyAcademicAssignment.findByIdAndUpdate(id, { ...data, updatedBy: userId }, { new: true, runValidators: true });
};

exports.updateStatus = async (id, status, userId) => {
  return await FacultyAcademicAssignment.findByIdAndUpdate(id, { assignmentStatus: status, updatedBy: userId }, { new: true });
};

exports.getMyAllocations = async (facultyProfileId) => {
  return await FacultyAcademicAssignment.find({ faculty: facultyProfileId, assignmentStatus: 'active' })
    .populate({
      path: 'faculty',
      populate: { path: 'user', select: 'fullName' }
    })
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterName semesterNumber')
    .populate('sectionId', 'name')
    .populate('subjectId', 'subjectName subjectCode')
    .sort({ createdAt: -1 });
};
