const allocationService = require('../../services/academic/facultyAcademicAllocationService');
const FacultyProfile = require('../../models/academic/FacultyProfile');

exports.createAllocation = async (req, res) => {
  try {
    const allocation = await allocationService.createAllocation(req.body, req.user.id);
    res.status(201).json({ success: true, data: allocation });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Faculty is already assigned to this subject/section combination' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllAllocations = async (req, res) => {
  try {
    const allocations = await allocationService.getAllocations(req.query);
    res.status(200).json({ success: true, count: allocations.length, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllocation = async (req, res) => {
  try {
    const allocation = await allocationService.getAllocationById(req.params.id);
    if (!allocation) return res.status(404).json({ success: false, error: 'Allocation not found' });
    res.status(200).json({ success: true, data: allocation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateAllocation = async (req, res) => {
  try {
    const allocation = await allocationService.updateAllocation(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, data: allocation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const allocation = await allocationService.updateStatus(req.params.id, req.body.status, req.user.id);
    res.status(200).json({ success: true, data: allocation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getMyAllocations = async (req, res) => {
  try {
    // Stage 2 setup user.facultyProfileId, or we find it
    let facultyProfileId = req.user?.facultyProfileId; 
    if (!facultyProfileId && req.user) {
      const profile = await FacultyProfile.findOne({ user: req.user.id });
      if (profile) facultyProfileId = profile._id;
    }

    if (!facultyProfileId) return res.status(400).json({ success: false, error: 'Faculty profile not linked to user' });
    
    const allocations = await allocationService.getMyAllocations(facultyProfileId);
    res.status(200).json({ success: true, count: allocations.length, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
