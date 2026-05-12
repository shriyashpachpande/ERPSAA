const internalMarksService = require('../../services/academic/internalMarksService');

exports.saveMarks = async (req, res) => {
  try {
    const marksData = Array.isArray(req.body.marks) ? req.body.marks : [req.body];
    const results = await internalMarksService.bulkUpsertMarks(marksData, req.user.id);
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
    // Assuming student identity is linked to user
    // We need a helper to find the studentId from req.user.id
    // For now, assume it's passed or available in a context
    const records = await internalMarksService.getStudentMarksSummary(req.query.studentId);
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
