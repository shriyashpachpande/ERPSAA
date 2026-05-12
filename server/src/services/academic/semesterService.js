const Semester = require('../../models/academic/Semester');

exports.createSemester = async (data, userId) => {
  return await Semester.create({ ...data, createdBy: userId });
};

exports.getSemesters = async (filters = {}) => {
  return await Semester.find(filters).populate('academicYearId', 'name isCurrent').sort({ semesterNumber: 1 });
};

exports.getSemesterById = async (id) => {
  return await Semester.findById(id).populate('academicYearId', 'name isCurrent');
};

exports.updateSemester = async (id, data, userId) => {
  return await Semester.findByIdAndUpdate(id, { ...data, updatedBy: userId }, { new: true, runValidators: true });
};

exports.toggleStatus = async (id, status, userId) => {
  return await Semester.findByIdAndUpdate(id, { status, updatedBy: userId }, { new: true });
};
