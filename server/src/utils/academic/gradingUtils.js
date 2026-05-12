/**
 * Grading Utility for Academic Results
 */

exports.calculateGrade = (obtained, max) => {
  if (!max || max <= 0) return 'N/A';
  const percentage = (obtained / max) * 100;

  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 40) return 'E';
  return 'F';
};

exports.getGradePoint = (grade) => {
  const points = {
    'A+': 10,
    'A': 9,
    'B': 8,
    'C': 7,
    'D': 6,
    'E': 5,
    'F': 0
  };
  return points[grade] || 0;
};
