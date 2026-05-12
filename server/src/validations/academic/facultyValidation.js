/**
 * Basic faculty creation validation
 */
exports.validateFaculty = (data) => {
  const errors = [];
  
  if (!data.fullName) errors.push('Full Name is required');
  if (!data.employeeId) errors.push('Employee ID is required');
  if (!data.personalEmail) errors.push('Personal Email is required');
  if (!data.joiningDate) errors.push('Joining Date is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
