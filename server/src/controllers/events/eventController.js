const EventBooking = require('../../models/events/EventBooking');

// @desc    Create new event booking
// @route   POST /api/events/book
// @access  Private (student)
exports.createBooking = async (req, res) => {
  try {
    const { facility, purpose, date, startTime, endTime } = req.body;

    // Use logged in user
    const studentId = req.user._id;
    const studentName = req.user.fullName;

    if (!facility || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check for overlap - similar logic to old HTML project
    const conflict = await EventBooking.findOne({
      facility,
      date,
      status: 'approved',
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: "This time slot is already booked for the selected facility." });
    }

    const booking = await EventBooking.create({
      studentId,
      studentName,
      facility,
      purpose,
      date,
      startTime,
      endTime,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: "Booking request submitted successfully."
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get student's own bookings
// @route   GET /api/events/my-requests
// @access  Private (student)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await EventBooking.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Cancel a pending request
// @route   POST /api/events/cancel/:id
// @access  Private (student)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await EventBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    
    // Ensure the student owns it
    if (booking.studentId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: "Not authorized to cancel this booking" });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: "Only pending bookings can be canceled" });
    }

    await EventBooking.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Booking canceled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===========================================
// SPORT TEACHER METHODS
// ===========================================

// @desc    Get all bookings
// @route   GET /api/events/all
// @access  Private (sport_teacher, super_admin)
exports.getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
        filter.status = req.query.status;
    }
    const bookings = await EventBooking.find(filter).sort({ date: -1, startTime: 1 });
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Approve a booking request
// @route   PUT /api/events/approve/:id
// @access  Private (sport_teacher, super_admin)
exports.approveBooking = async (req, res) => {
  try {
    const booking = await EventBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== 'pending') {
         return res.status(400).json({ success: false, message: `Booking is already ${booking.status}` });
    }

    booking.status = 'approved';
    booking.reviewedBy = req.user._id;
    await booking.save();

    // Auto-reject conflicting pending requests
    await EventBooking.updateMany({
      _id: { $ne: booking._id },
      facility: booking.facility,
      date: booking.date,
      status: 'pending',
      startTime: { $lt: booking.endTime },
      endTime: { $gt: booking.startTime }
    }, { 
      $set: { 
        status: 'rejected',
        reviewNote: 'Slot was booked by another approved request.'
      } 
    });

    res.status(200).json({
      success: true,
      message: "Booking approved and conflicts rejected."
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Reject a booking request
// @route   PUT /api/events/reject/:id
// @access  Private (sport_teacher, super_admin)
exports.rejectBooking = async (req, res) => {
  try {
    const { reviewNote } = req.body;
    const booking = await EventBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== 'pending') {
         return res.status(400).json({ success: false, message: `Booking is already ${booking.status}` });
    }

    booking.status = 'rejected';
    booking.reviewedBy = req.user._id;
    if (reviewNote) booking.reviewNote = reviewNote;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully."
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
