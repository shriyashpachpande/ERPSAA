const AcademicSection = require('../../models/academic/AcademicSection');

exports.createSection = async (data, userId) => {
  return await AcademicSection.create({ ...data, createdBy: userId });
};

exports.getSections = async (filters = {}) => {
  const query = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      query[key] = value;
    }
  }

  return await AcademicSection.find(query)
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterName semesterNumber')
    .populate('classTeacherFacultyId', 'employeeId')
    .populate({
      path: 'mentorFacultyId',
      populate: { path: 'user', select: 'fullName email' }
    })
    .sort({ name: 1 });
};

exports.getSectionById = async (id) => {
  return await AcademicSection.findById(id)
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterName')
    .populate('classTeacherFacultyId')
    .populate({
      path: 'mentorFacultyId',
      populate: { path: 'user', select: 'fullName email' }
    });
};

exports.updateSection = async (id, data, userId) => {
  return await AcademicSection.findByIdAndUpdate(id, { ...data, updatedBy: userId }, { new: true, runValidators: true });
};

exports.toggleStatus = async (id, status, userId) => {
  return await AcademicSection.findByIdAndUpdate(id, { status, updatedBy: userId }, { new: true });
};
