const sectionService = require('../../services/academic/sectionManagementService');

exports.createSection = async (req, res) => {
  try {
    const section = await sectionService.createSection(req.body, req.user.id);
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Section name already exists for this semester and course' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllSections = async (req, res) => {
  try {
    const sections = await sectionService.getSections(req.query);
    res.status(200).json({ success: true, count: sections.length, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSection = async (req, res) => {
  try {
    const section = await sectionService.getSectionById(req.params.id);
    if (!section) return res.status(404).json({ success: false, error: 'Section not found' });
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const section = await sectionService.updateSection(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const section = await sectionService.toggleStatus(req.params.id, req.body.status, req.user.id);
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
