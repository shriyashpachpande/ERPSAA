const internalMarksService = require('../../services/academic/internalMarksService');

exports.saveMarks = async (req, res) => {
  try {
    const marksData = Array.isArray(req.body.marks) ? req.body.marks : [req.body];
    const results = await internalMarksService.bulkUpsertMarks(marksData, req.user.id, req.user.role);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getMarks = async (req, res) => {
  try {
    const records = await internalMarksService.getMarksRecords(req.query);
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyMarks = async (req, res) => {
  try {
    const StudentMaster = require('../../models/student-master/StudentMaster');
    const studentProfile = await StudentMaster.findOne({ userId: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }
    const records = await internalMarksService.getStudentMarksSummary(studentProfile._id);
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
