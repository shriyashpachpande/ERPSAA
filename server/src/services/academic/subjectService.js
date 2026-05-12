const AcademicSubject = require('../../models/academic/AcademicSubject');

exports.createSubject = async (data, userId) => {
  return await AcademicSubject.create({ ...data, createdBy: userId });
};

exports.getSubjects = async (filters = {}) => {
  let query = {};
  if (filters.department) query.department = filters.department;
  if (filters.subjectType) query.subjectType = filters.subjectType;
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    query.$or = [
      { subjectName: { $regex: filters.search, $options: 'i' } },
      { subjectCode: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return await AcademicSubject.find(query).sort({ subjectCode: 1 });
};

exports.getSubjectById = async (id) => {
  return await AcademicSubject.findById(id);
};

exports.updateSubject = async (id, data, userId) => {
  return await AcademicSubject.findByIdAndUpdate(id, { ...data, updatedBy: userId }, { new: true, runValidators: true });
};

exports.toggleStatus = async (id, status, userId) => {
  return await AcademicSubject.findByIdAndUpdate(id, { status, updatedBy: userId }, { new: true });
};
