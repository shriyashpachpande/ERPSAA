exports.validateAcademicYear = (data) => {
  const errors = [];
  if (!data.name) errors.push('Academic year name is required');
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
