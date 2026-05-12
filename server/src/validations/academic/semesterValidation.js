exports.validateSemester = (data) => {
  const errors = [];
  if (!data.semesterNumber) errors.push('Semester number is required');
  if (!data.academicYearId) errors.push('Academic year is required');
  if (!data.startDate) errors.push('Start date is required');
  if (!data.endDate) errors.push('End date is required');
  
  if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
    errors.push('Start date must be before end date');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
