const FacilityBooking = require('../../models/eventsFacilities/FacilityBooking.events.model');

exports.getPendingRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await FacilityBooking.find(filter).sort('date');
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const booking = await FacilityBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.status = 'approved';
    booking.reviewedBy = req.user.id;
    booking.reviewedAt = Date.now();
    await booking.save();

    // Reject all other overlapping pending requests
    await FacilityBooking.updateMany({
      _id: { $ne: booking._id },
      facilityId: booking.facilityId,
      date: booking.date,
      status: 'pending',
      $and: [
        { startTime: { $lt: booking.endTime } },
        { endTime: { $gt: booking.startTime } }
      ]
    }, {
      $set: { status: 'rejected', reviewNote: 'Slot occupied by an approved event. Auto-rejected.' }
    });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const booking = await FacilityBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.status = 'rejected';
    booking.reviewedBy = req.user.id;
    booking.reviewNote = req.body.reason || 'Rejected by authorities';
    booking.reviewedAt = Date.now();
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getFacilitySchedule = async (req, res) => {
  try {
    const { category, facility, date } = req.query;
    const filter = { status: 'approved' }; 

    if (category) filter.categorySlug = category;
    if (facility) filter.facilityId = facility;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const bookings = await FacilityBooking.find(filter)
      .populate('facilityId', 'name location')
      .sort('date startTime');
      
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getConflicts = async (req, res) => {
  try {
    const { date, facilityId } = req.query;
    const filter = { status: { $in: ['pending', 'approved'] } };
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (facilityId) filter.facilityId = facilityId;

    const allBookings = await FacilityBooking.find(filter)
      .populate('facilityId', 'name')
      .sort('date facilityId startTime');

    const conflicts = [];
    const groupings = {};

    allBookings.forEach(b => {
      const key = `${b.facilityId._id}_${new Date(b.date).toDateString()}`;
      if (!groupings[key]) groupings[key] = [];
      groupings[key].push(b);
    });

    Object.values(groupings).forEach(group => {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const b1 = group[i];
          const b2 = group[j];
          if (b1.startTime < b2.endTime && b1.endTime > b2.startTime) {
            conflicts.push({
              facility: b1.facilityId.name,
              date: b1.date,
              request1: {
                id: b1._id,
                student: b1.studentName,
                time: `${b1.startTime} - ${b1.endTime}`,
                status: b1.status
              },
              request2: {
                id: b2._id,
                student: b2.studentName,
                time: `${b2.startTime} - ${b2.endTime}`,
                status: b2.status
              },
              conflictType: (b1.status === 'approved' || b2.status === 'approved') ? 'Approved-Overlap' : 'Double-Pending'
            });
          }
        }
      }
    });

    res.status(200).json({ success: true, data: conflicts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
