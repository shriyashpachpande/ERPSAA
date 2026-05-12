/**
 * @desc    Get Subjects
 * @route   GET /api/academic/subjects
 * @access  Private
 */
exports.getSubjects = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get subjects placeholder',
    data: []
  });
};

/**
 * @desc    Create Subject
 * @route   POST /api/academic/subjects
 * @access  Private (Academic Admin, Super Admin)
 */
exports.createSubject = async (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create subject placeholder'
  });
};
