const resultProcessingService = require('../../services/academic/resultProcessingService');

exports.generateResults = async (req, res) => {
  try {
    const results = await resultProcessingService.generateSectionResults(req.body, req.user.id);
    res.status(200).json({ success: true, data: results, message: `Successfully generated ${results.length} results.` });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.publishResults = async (req, res) => {
  try {
    const { academicYearId, semesterId, sectionId } = req.body;
    await resultProcessingService.publishResults(academicYearId, semesterId, sectionId);
    res.status(200).json({ success: true, message: 'Results published successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
