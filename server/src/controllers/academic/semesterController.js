const semesterService = require('../../services/academic/semesterService');

exports.createSemester = async (req, res) => {
  try {
    const sem = await semesterService.createSemester(req.body, req.user.id);
    res.status(201).json({ success: true, data: sem });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Semester number already exists for this academic year' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllSemesters = async (req, res) => {
  try {
    const filters = {};
    if (req.query.academicYearId) filters.academicYearId = req.query.academicYearId;
    if (req.query.status) filters.status = req.query.status;

    const semesters = await semesterService.getSemesters(filters);
    res.status(200).json({ success: true, count: semesters.length, data: semesters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSemester = async (req, res) => {
  try {
    const sem = await semesterService.getSemesterById(req.params.id);
    if (!sem) return res.status(404).json({ success: false, error: 'Semester not found' });
    res.status(200).json({ success: true, data: sem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSemester = async (req, res) => {
  try {
    const sem = await semesterService.updateSemester(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, data: sem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const sem = await semesterService.toggleStatus(req.params.id, req.body.status, req.user.id);
    res.status(200).json({ success: true, data: sem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
