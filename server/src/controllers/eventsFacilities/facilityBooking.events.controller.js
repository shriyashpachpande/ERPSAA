const FacilityBooking = require('../../models/eventsFacilities/FacilityBooking.events.model');
const Facility = require('../../models/eventsFacilities/Facility.events.model');
const FacilityCategory = require('../../models/eventsFacilities/FacilityCategory.events.model');

exports.createBooking = async (req, res) => {
  try {
    const { facilitySlug, date, startTime, endTime, purpose } = req.body;

    const facility = await Facility.findOne({ slug: facilitySlug }).populate('categoryId');
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });

    // Conflict Check 
    // Is there already an approved booking that overlaps?
    const conflict = await FacilityBooking.findOne({
      facilityId: facility._id,
      date: new Date(date),
      status: 'approved',
      $and: [
        { startTime: { $lt: endTime } },
        { endTime: { $gt: startTime } }
      ]
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: 'This slot is already booked and approved.' });
    }

    const booking = await FacilityBooking.create({
      studentId: req.user.id,
      studentName: req.user.fullName || req.user.name,
      facilityId: facility._id,
      facilityName: facility.name,
      categorySlug: facility.categoryId.slug,
      purpose,
      date,
      startTime,
      endTime
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', details: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await FacilityBooking.find({ studentId: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
