exports.validateAllocation = (data) => {
  const errors = [];
  if (!data.faculty) errors.push('Faculty reference is required');
  if (!data.academicYearId) errors.push('Academic year is required');
  if (!data.semesterId) errors.push('Semester is required');
  if (!data.sectionId) errors.push('Section is required');
  if (!data.subjectId) errors.push('Subject is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
