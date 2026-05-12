const notificationService = require('../../services/library-management/notification.service');

const getStudentNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getStudentNotifications(req.params.studentId);
        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await notificationService.markAsRead(req.params.id);
        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const triggerReminders = async (req, res) => {
    try {
        await notificationService.triggerDueReminders();
        res.status(200).json({ success: true, message: 'Reminders triggered successfully' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = {
    getStudentNotifications,
    markAsRead,
    triggerReminders
};
