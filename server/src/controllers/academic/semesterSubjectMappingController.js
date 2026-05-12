const mappingService = require('../../services/academic/semesterSubjectMappingService');

exports.createMapping = async (req, res) => {
  try {
    const mapping = await mappingService.createMapping(req.body, req.user.id);
    res.status(201).json({ success: true, data: mapping });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'This subject is already mapped to this semester' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.bulkCreateMapping = async (req, res) => {
  try {
    const { academicYearId, department, semesterId, subjectIds } = req.body;
    const result = await mappingService.bulkCreateMapping(academicYearId, department, semesterId, subjectIds, req.user.id);
    res.status(201).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllMappings = async (req, res) => {
  try {
    const filters = {};
    if (req.query.academicYearId) filters.academicYearId = req.query.academicYearId;
    if (req.query.department) filters.department = req.query.department;
    if (req.query.semesterId) filters.semesterId = req.query.semesterId;
    
    const mappings = await mappingService.getMappings(filters);
    res.status(200).json({ success: true, count: mappings.length, data: mappings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteMapping = async (req, res) => {
  try {
    await mappingService.deleteMapping(req.params.id);
    res.status(200).json({ success: true, message: 'Mapping removed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
