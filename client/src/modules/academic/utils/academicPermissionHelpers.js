/**
 * Helpers to check academic-specific permissions
 */
export const canManageFaculty = (role) => {
  return ['super_admin', 'academic_admin'].includes(role);
};

export const canViewAllFaculty = (role) => {
  return ['super_admin', 'academic_admin', 'hod'].includes(role);
};

export const canAssignFaculty = (role) => {
  return ['super_admin', 'academic_admin', 'hod'].includes(role);
};
