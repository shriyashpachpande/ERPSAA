exports.validateMapping = (data) => {
  const errors = [];
  if (!data.academicYearId) errors.push('Academic year is required');
  if (!data.semesterId) errors.push('Semester is required');
  if (!data.subjectId && (!data.subjectIds || data.subjectIds.length === 0)) {
    errors.push('At least one subject is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
