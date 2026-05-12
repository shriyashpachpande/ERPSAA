const AcademicYear = require('../../models/academic/AcademicYear');

exports.createYear = async (data, userId) => {
  if (data.isCurrent) {
    await AcademicYear.updateMany({}, { isCurrent: false });
  }
  return await AcademicYear.create({ ...data, createdBy: userId });
};

exports.getYears = async (filters = {}) => {
  return await AcademicYear.find(filters).sort({ startDate: -1 });
};

exports.getYearById = async (id) => {
  return await AcademicYear.findById(id);
};

exports.updateYear = async (id, data, userId) => {
  if (data.isCurrent) {
    await AcademicYear.updateMany({ _id: { $ne: id } }, { isCurrent: false });
  }
  return await AcademicYear.findByIdAndUpdate(id, { ...data, updatedBy: userId }, { new: true, runValidators: true });
};

exports.setCurrentYear = async (id, userId) => {
  await AcademicYear.updateMany({}, { isCurrent: false });
  return await AcademicYear.findByIdAndUpdate(id, { isCurrent: true, updatedBy: userId }, { new: true });
};

exports.toggleStatus = async (id, status, userId) => {
  return await AcademicYear.findByIdAndUpdate(id, { status, updatedBy: userId }, { new: true });
};
