/**
 * @desc    Get Semesters
 * @route   GET /api/academic/semesters
 * @access  Private
 */
exports.getSemesters = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get semesters placeholder',
    data: []
  });
};

/**
 * @desc    Create Semester
 * @route   POST /api/academic/semesters
 * @access  Private (Academic Admin, Super Admin)
 */
exports.createSemester = async (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create semester placeholder'
  });
};
