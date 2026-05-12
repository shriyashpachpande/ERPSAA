/**
 * @desc    Get Academic Years
 * @route   GET /api/academic/structure/years
 * @access  Private
 */
exports.getAcademicYears = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get academic years placeholder',
    data: []
  });
};

/**
 * @desc    Create Academic Year
 * @route   POST /api/academic/structure/years
 * @access  Private (Academic Admin, Super Admin)
 */
exports.createAcademicYear = async (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create academic year placeholder'
  });
};
