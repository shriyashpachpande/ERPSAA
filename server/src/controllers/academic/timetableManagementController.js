const timetableService = require('../../services/academic/timetableManagementService');
const FacultyProfile = require('../../models/academic/FacultyProfile');

exports.createEntry = async (req, res) => {
  try {
    const entry = await timetableService.createEntry(req.body, req.user.id);
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const entries = await timetableService.getEntries(req.query, req.user);
    res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEntry = async (req, res) => {
  try {
    const entry = await timetableService.getEntryById(req.params.id, req.user);
    if (!entry) return res.status(404).json({ success: false, error: 'Entry not found' });
    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const entry = await timetableService.updateEntry(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    await timetableService.deleteEntry(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getSectionTimetable = async (req, res) => {
  try {
    console.log(`[DEBUG] Controller getSectionTimetable, sectionId: ${req.params.sectionId}`);
    const entries = await timetableService.getSectionTimetable(req.params.sectionId, req.user);
    console.log(`[DEBUG] Controller returning ${entries.length} entries`);
    res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFacultyTimetable = async (req, res) => {
  try {
    let facultyId = req.params.facultyId || req.params.facultyProfileId;
    
    if (!facultyId && req.user) {
      const profile = await FacultyProfile.findOne({ user: req.user.id });
      if (profile) {
        facultyId = profile._id;
      }
    }

    if (!facultyId) return res.status(400).json({ success: false, error: 'Faculty profile not identified' });
    
    const entries = await timetableService.getFacultyTimetable(facultyId);
    res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
