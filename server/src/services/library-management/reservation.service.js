const mongoose = require('mongoose');
const policyService = require('./policy.service');
const notificationService = require('./notification.service');
const { v4: uuidv4 } = require('uuid');
const Reservation = require('../../models/library-management/reservations.model');
const BookCopy = require('../../models/library-management/bookCopies.model');
const Book = require('../../models/library-management/books.model');

const createReservation = async (studentId, bookId) => {
    // STEP 2: LOG THE BACKEND INPUT (AS REQUESTED)
    console.log(`[RESERVATION_SERVICE_DEBUG] studentId: ${studentId}, bookId: ${bookId}`);

    // Support both String and ObjectId for matching (Type-Agnostic)
    const bookObjectId = mongoose.Types.ObjectId.isValid(bookId) ? new mongoose.Types.ObjectId(bookId) : null;
    const bookIds = [bookId, bookObjectId].filter(id => id !== null);

    // Fetch book record
    const bookRecord = await Book.findById(bookObjectId || bookId);
    console.log(`[RESERVATION_SERVICE_DEBUG] Book Record Found: ${bookRecord ? bookRecord.title : 'NOT FOUND'}`);

    // 1. Check if student already has an active reservation for this book
    const existing = await Reservation.findOne({ 
        studentId, 
        bookId: { $in: bookIds }, 
        status: { $in: ['ACTIVE', 'NOTIFIED'] } 
    });
    if (existing) {
        console.log(`[RESERVATION_SERVICE_DEBUG] Validation Failed: Student already has active reservation`);
        throw new Error('You already have an active reservation for this book');
    }

    // 2. Check if any copies are available (should issue instead)
    const allCopies = await BookCopy.find({ bookId: { $in: bookIds } });
    const availableCopies = allCopies.filter(c => String(c.status).toUpperCase() === 'AVAILABLE');
    const reservedCopies = allCopies.filter(c => String(c.status).toUpperCase() === 'RESERVED');
    const issuedCopies = allCopies.filter(c => String(c.status).toUpperCase() === 'ISSUED');

    console.log(`[RESERVATION_SERVICE_DEBUG] --- COPY ANALYSIS ---`);
    console.log(`Total Book Copies Found: ${allCopies.length}`);
    console.log(`AVAILABLE Copies: ${availableCopies.length}`);
    console.log(`RESERVED Copies: ${reservedCopies.length}`);
    console.log(`ISSUED Copies: ${issuedCopies.length}`);
    if (allCopies.length > 0) {
        console.log(`RAW copy data (first 3):`, allCopies.slice(0, 3).map(c => ({ id: c._id, copyId: c.copyId, status: c.status })));
    }
    console.log(`----------------------------------`);

    if (availableCopies.length > 0) {
        console.log(`[RESERVATION_SERVICE_DEBUG] Validation Failed: AVAILABLE_COPIES_FOUND_BRANCH`);
        throw new Error('Copies are currently available. Please issue the book instead of reserving.');
    }

    if (allCopies.length === 0) {
        console.log(`[RESERVATION_SERVICE_DEBUG] WARNING: No copies found at all. This might be a data link issue.`);
    }

    // 3. Determine queue position
    const latestReservation = await Reservation.findOne({ bookId: { $in: bookIds }, status: 'ACTIVE' }).sort({ queuePosition: -1 });
    const queuePosition = latestReservation ? latestReservation.queuePosition + 1 : 1;

    const reservationId = `RES-${uuidv4().substring(0, 8).toUpperCase()}`;
    const reservation = new Reservation({
        reservationId,
        studentId,
        bookId: bookObjectId || bookId,
        queuePosition,
        status: 'ACTIVE'
    });

    console.log(`[RESERVATION_SERVICE_DEBUG] Creating reservation with queuePosition: ${queuePosition}`);
    return await reservation.save();
};

const getStudentReservations = async (studentId) => {
    return await Reservation.find({ studentId }).populate('bookId').sort({ createdAt: -1 });
};

const getBookReservations = async (bookId) => {
    const bookObjectId = mongoose.Types.ObjectId.isValid(bookId) ? new mongoose.Types.ObjectId(bookId) : null;
    const bookIds = [bookId, bookObjectId].filter(id => id !== null);
    return await Reservation.find({ bookId: { $in: bookIds }, status: 'ACTIVE' }).sort({ queuePosition: 1 });
};

const notifyNextInQueue = async (bookId) => {
    const bookObjectId = mongoose.Types.ObjectId.isValid(bookId) ? new mongoose.Types.ObjectId(bookId) : null;
    const bookIds = [bookId, bookObjectId].filter(id => id !== null);
    
    const nextReservation = await Reservation.findOne({ bookId: { $in: bookIds }, status: 'ACTIVE' }).sort({ queuePosition: 1 });
    if (!nextReservation) return null;

    const policy = await policyService.getActivePolicy();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + policy.reservationHoldHours);

    nextReservation.status = 'NOTIFIED';
    nextReservation.expiresAt = expiresAt;

    await nextReservation.save();

    // Notify student
    await notificationService.createNotification({
        studentId: nextReservation.studentId,
        type: 'RESERVATION_READY',
        title: 'Book Reserved is Ready!',
        message: `The book you reserved is now available. Please collect it within ${policy.reservationHoldHours} hours.`,
        relatedReservationId: nextReservation._id
    });

    return nextReservation;
};

module.exports = {
    createReservation,
    getStudentReservations,
    getBookReservations,
    notifyNextInQueue
};
