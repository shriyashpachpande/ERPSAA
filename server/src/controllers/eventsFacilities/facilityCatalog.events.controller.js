const FacilityCategory = require('../../models/eventsFacilities/FacilityCategory.events.model');
const Facility = require('../../models/eventsFacilities/Facility.events.model');

exports.getCategories = async (req, res) => {
  try {
    const categories = await FacilityCategory.find({ isActive: true });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getFacilitiesByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const category = await FacilityCategory.findOne({ slug: categorySlug });
    if (!category) return res.status(404).json({ success: false, error: 'Category not found' });

    const facilities = await Facility.find({ categoryId: category._id });
    res.status(200).json({ success: true, count: facilities.length, data: facilities, category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getFacilityBySlug = async (req, res) => {
  try {
    const facility = await Facility.findOne({ slug: req.params.facilitySlug }).populate('categoryId');
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });

    res.status(200).json({ success: true, data: facility });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({}).populate('categoryId');
    res.status(200).json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
