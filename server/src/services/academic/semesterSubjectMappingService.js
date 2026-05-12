const SemesterSubjectMapping = require('../../models/academic/SemesterSubjectMapping');

exports.createMapping = async (data, userId) => {
  return await SemesterSubjectMapping.create({ ...data, createdBy: userId });
};

exports.bulkCreateMapping = async (academicYearId, department, semesterId, subjectIds, userId) => {
  const mappings = subjectIds.map(subjectId => ({
    academicYearId,
    department,
    semesterId,
    subjectId,
    createdBy: userId
  }));
  
  // Use insertMany with ordered: false to skip duplicates if any
  return await SemesterSubjectMapping.insertMany(mappings, { ordered: false });
};

exports.getMappings = async (filters = {}) => {
  return await SemesterSubjectMapping.find(filters)
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterNumber semesterName')
    .populate('subjectId', 'subjectName subjectCode department credits subjectType')
    .sort({ semesterId: 1 });
};

exports.deleteMapping = async (id) => {
  return await SemesterSubjectMapping.findByIdAndDelete(id);
};
