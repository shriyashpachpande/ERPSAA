const reservationService = require('../../services/library-management/reservation.service');

const createReservation = async (req, res) => {
    try {
        const { bookId, studentId: bodyStudentId } = req.body;
        
        if (!bookId) {
            return res.status(400).json({ success: false, error: 'Book ID is required' });
        }

        // Use studentProfileId from auth if available, otherwise use bodyStudentId
        let studentId = (req.user && req.user.studentProfileId) || bodyStudentId;
        
        // Final attempt: Find StudentMaster by userId if we have a student role but no link yet
        if (!studentId && req.user) {
            const StudentMaster = require('../../models/student-master/StudentMaster');
            const student = await StudentMaster.findOne({ userId: req.user._id });
            if (student) studentId = student._id;
        }

        if (!studentId) {
            console.error('Reservation Failed: Student profile not found for user', req.user?._id);
            return res.status(400).json({ success: false, error: 'Student profile not properly linked. Please contact support.' });
        }

        // STEP 2: LOG THE BACKEND INPUT (AS REQUESTED)
        console.log("--- BACKEND RESERVATION DEBUG START ---");
        console.log("req.body:", req.body);
        console.log("parsed studentId:", studentId);
        console.log("parsed bookId:", bookId);
        if (req.user) console.log("user context:", { _id: req.user._id, role: req.user.role });

        const reservation = await reservationService.createReservation(studentId, bookId);
        
        console.log("--- BACKEND RESERVATION DEBUG SUCCESS ---");
        res.status(201).json({ success: true, data: reservation });
    } catch (err) {
        console.error('Reservation Logic Error:', err.message);
        res.status(400).json({ success: false, error: err.message });
    }
};

const getStudentReservations = async (req, res) => {
    try {
        const reservations = await reservationService.getStudentReservations(req.params.studentId);
        res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const getBookReservations = async (req, res) => {
    try {
        const reservations = await reservationService.getBookReservations(req.params.bookId);
        res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const cancelReservation = async (req, res) => {
    try {
        const reservation = await reservationService.cancelReservation(req.params.id);
        res.status(200).json({ success: true, data: reservation });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = {
    createReservation,
    getStudentReservations,
    getBookReservations,
    cancelReservation
};
