const LibraryNotification = require('../../models/library-management/notifications.model');
const IssueTransaction = require('../../models/library-management/issueTransactions.model');
const crypto = require('crypto');

const createNotification = async (data) => {
    const notificationId = `NOTIF-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
    const notification = new LibraryNotification({
        ...data,
        notificationId,
        sentAt: new Date()
    });
    return await notification.save();
};

const getStudentNotifications = async (studentId) => {
    return await LibraryNotification.find({ studentId }).sort({ createdAt: -1 });
};

const markAsRead = async (id) => {
    return await LibraryNotification.findByIdAndUpdate(id, { status: 'READ', readAt: new Date() }, { new: true });
};

const triggerDueReminders = async () => {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    // 1. Due in 3 days
    const upcoming = await IssueTransaction.find({
        status: 'ISSUED',
        dueDate: {
            $gte: new Date(threeDaysLater.setHours(0,0,0,0)),
            $lte: new Date(threeDaysLater.setHours(23,59,59,999))
        }
    }).populate('bookId');

    for (const trx of upcoming) {
        await createNotification({
            studentId: trx.studentId,
            type: 'DUE_REMINDER',
            title: 'Book Due Soon',
            message: `Your borrowed book "${trx.bookId.title}" is due in 3 days.`,
            relatedTransactionId: trx._id
        });
    }

    // 2. Overdue Alerts
    const overdue = await IssueTransaction.find({
        status: 'ISSUED',
        dueDate: { $lt: today }
    }).populate('bookId');

    for (const trx of overdue) {
        // Mark as OVERDUE if not already
        if (trx.status !== 'OVERDUE') {
            trx.status = 'OVERDUE';
            await trx.save();
        }

        await createNotification({
            studentId: trx.studentId,
            type: 'OVERDUE_ALERT',
            title: 'Book Overdue',
            message: `Your borrowed book "${trx.bookId.title}" is now overdue. Please return it as soon as possible to avoid fines.`,
            relatedTransactionId: trx._id
        });
    }
};

module.exports = {
    createNotification,
    getStudentNotifications,
    markAsRead,
    triggerDueReminders
};
