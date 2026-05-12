const subjectService = require('../../services/academic/subjectService');
const FacultyProfile = require('../../models/academic/FacultyProfile');

exports.createSubject = async (req, res) => {
  try {
    let payload = { ...req.body };
    if (req.user.isHOD) {
      if (!req.user.department) return res.status(403).json({ success: false, error: 'HOD department not found' });
      payload.department = req.user.department;
    }
    const subject = await subjectService.createSubject(payload, req.user.id);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Subject code already exists' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    let filters = { ...req.query };
    if (req.user.isHOD) {
      if (!req.user.department) return res.status(403).json({ success: false, error: 'HOD department not found' });
      filters.department = req.user.department; // Force departmental filter
    }
    const subjects = await subjectService.getSubjects(filters);
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSubject = async (req, res) => {
  try {
    const subject = await subjectService.getSubjectById(req.params.id);
    if (!subject) return res.status(404).json({ success: false, error: 'Subject not found' });
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    let payload = { ...req.body };
    if (req.user.isHOD) {
      if (!req.user.department) return res.status(403).json({ success: false, error: 'HOD department not found' });
      
      const existing = await subjectService.getSubjectById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, error: 'Subject not found' });
      
      if (existing.department !== req.user.department) {
        return res.status(403).json({ success: false, error: 'Not authorized to update subjects outside your department' });
      }
      payload.department = req.user.department; // Prevent moving to another department
    }
    
    const subject = await subjectService.updateSubject(req.params.id, payload, req.user.id);
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (req.user.isHOD) {
      if (!req.user.department) return res.status(403).json({ success: false, error: 'HOD department not found' });
      
      const existing = await subjectService.getSubjectById(req.params.id);
      if (!existing || existing.department !== req.user.department) {
        return res.status(403).json({ success: false, error: 'Not authorized to update subjects outside your department' });
      }
    }

    const subject = await subjectService.toggleStatus(req.params.id, req.body.status, req.user.id);
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
