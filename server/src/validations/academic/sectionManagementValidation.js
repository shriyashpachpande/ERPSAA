exports.validateSection = (data) => {
  const errors = [];
  if (!data.name) errors.push('Section name is required');
  if (!data.academicYearId) errors.push('Academic year is required');
  if (!data.semesterId) errors.push('Semester is required');
  if (!data.course) errors.push('Course is required');
  if (!data.capacity) errors.push('Capacity is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
