const facultyService = require('../../services/academic/facultyManagementService');

/**
 * @desc    Create new Faculty
 * @route   POST /api/academic/faculty
 * @access  Private (Academic Admin, Super Admin)
 */
exports.createFaculty = async (req, res) => {
  try {
    const result = await facultyService.registerFaculty(req.body, req.user.id);
    
    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      data: {
        profileId: result.profile._id,
        fullName: result.user.fullName,
        erpEmail: result.user.email,
        tempPassword: result.tempPassword // IMPORTANT: Frontend should display this once
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Get all Faculty
 * @route   GET /api/academic/faculty
 * @access  Private (Academic Admin, HOD, Super Admin)
 */
exports.getFacultyList = async (req, res) => {
  try {
    const filters = {};
    
    // Strict RBAC: HOD can only see their own department
    if (req.user.role === 'hod') {
      if (!req.user.department) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
      filters.department = req.user.department;
    } else if (req.query.department) {
      filters.department = req.query.department;
    }

    if (req.query.status) filters.status = req.query.status;

    const faculty = await facultyService.getAllFaculty(filters);
    
    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get Faculty Details
 * @route   GET /api/academic/faculty/:id
 * @access  Private
 */
exports.getFacultyDetail = async (req, res) => {
  try {
    const faculty = await facultyService.getFacultyById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }
    
    // RBAC check: Faculty can only see own profile
    if (req.user.role === 'faculty' && faculty.user._id.toString() !== req.user.id) {
       return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update Faculty Status
 * @route   PATCH /api/academic/faculty/:id/status
 * @access  Private (Academic Admin, Super Admin)
 */
exports.toggleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const profile = await facultyService.updateFacultyStatus(req.params.id, status);
    
    res.status(200).json({
      success: true,
      message: `Faculty status updated to ${status}`,
      data: profile
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete or Deactivate faculty based on academic dependencies
 * @route   DELETE /api/academic/faculty/:id
 * @access  Private (Academic Admin, Super Admin)
 */
exports.deleteFaculty = async (req, res) => {
  try {
    const result = await facultyService.deleteFaculty(req.params.id);
    
    res.status(200).json({
      success: true,
      message: result.message,
      hardDeleted: result.hardDeleted,
      data: result.profile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
