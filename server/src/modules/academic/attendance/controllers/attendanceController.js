const attendanceService = require('../services/attendanceService');
const FacultyProfile = require('../../../../models/academic/FacultyProfile');

exports.getSubjects = async (req, res) => {
    try {
        const subjects = await attendanceService.getSubjectsForSection(req.query.sectionId);
        res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getStudents = async (req, res) => {
    try {
        const students = await attendanceService.getStudentsForSection(req.query.sectionId);
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const { sessionData, entriesData } = req.body;
        
        // Ensure facultyId is handled (either from body or resolved from current user)
        if (!sessionData.facultyId && (req.user.role === 'faculty' || req.user.role === 'hod')) {
            const profile = await FacultyProfile.findOne({ user: req.user.id });
            if (profile) sessionData.facultyId = profile._id;
        }

        const session = await attendanceService.markAttendance(sessionData, entriesData, req.user.id);
        res.status(201).json({ success: true, data: session });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getStudentStats = async (req, res) => {
    try {
        const stats = await attendanceService.getStudentAttendanceStats(req.params.studentMasterId || req.user.studentMasterId);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getSessions = async (req, res) => {
    try {
        const sessions = await attendanceService.getAttendanceSessions(req.query, req.user);
        res.status(200).json({ success: true, count: sessions.length, data: sessions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
