exports.validateTimetableEntry = (data) => {
  const errors = [];
  if (!data.academicYearId) errors.push('Academic year is required');
  if (!data.semesterId) errors.push('Semester is required');
  if (!data.sectionId) errors.push('Section is required');
  if (!data.subjectId) errors.push('Subject is required');
  if (!data.facultyProfileId) errors.push('Faculty is required');
  if (!data.dayOfWeek) errors.push('Day of week is required');
  if (!data.startTime) errors.push('Start time is required');
  if (!data.endTime) errors.push('End time is required');
  if (!data.roomOrLab) errors.push('Room or Lab location is required');
  
  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    errors.push('End time must be after start time');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
