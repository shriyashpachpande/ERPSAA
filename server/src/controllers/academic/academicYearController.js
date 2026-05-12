const academicYearService = require('../../services/academic/academicYearService');
const { validateAcademicYear } = require('../../validations/academic/academicYearValidation');

exports.createAcademicYear = async (req, res) => {
  try {
    const { isValid, errors } = validateAcademicYear(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, error: errors.join(', ') });
    }

    const year = await academicYearService.createYear(req.body, req.user.id);
    res.status(201).json({ success: true, data: year });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllAcademicYears = async (req, res) => {
  try {
    const years = await academicYearService.getYears(req.query);
    res.status(200).json({ success: true, count: years.length, data: years });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAcademicYear = async (req, res) => {
  try {
    const year = await academicYearService.getYearById(req.params.id);
    if (!year) return res.status(404).json({ success: false, error: 'Academic year not found' });
    res.status(200).json({ success: true, data: year });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateAcademicYear = async (req, res) => {
  try {
    const { isValid, errors } = validateAcademicYear(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, error: errors.join(', ') });
    }

    const year = await academicYearService.updateYear(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, data: year });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.setCurrent = async (req, res) => {
  try {
    const year = await academicYearService.setCurrentYear(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: year });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const year = await academicYearService.toggleStatus(req.params.id, req.body.status, req.user.id);
    res.status(200).json({ success: true, data: year });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
