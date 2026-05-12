exports.validateSubject = (data) => {
  const errors = [];
  if (!data.subjectName) errors.push('Subject name is required');
  if (!data.subjectCode) errors.push('Subject code is required');
  if (!data.department) errors.push('Department is required');
  if (!data.credits) errors.push('Credits are required');
  if (!data.subjectType) errors.push('Subject type is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
