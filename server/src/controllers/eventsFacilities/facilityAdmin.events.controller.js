const Facility = require('../../models/eventsFacilities/Facility.events.model');
const FacilityCategory = require('../../models/eventsFacilities/FacilityCategory.events.model');

exports.getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find().populate('categoryId');
    res.status(200).json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateFacilityStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const facility = await Facility.findByIdAndUpdate(
       req.params.id, 
       { status }, 
       { new: true, runValidators: true }
    );
    if(!facility) return res.status(404).json({ success: false, message: 'Not found' });
    
    res.status(200).json({ success: true, data: facility });
  } catch(error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}
