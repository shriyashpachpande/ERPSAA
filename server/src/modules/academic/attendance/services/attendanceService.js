const AttendanceSession = require('../models/AttendanceSession');
const AttendanceEntry = require('../models/AttendanceEntry');
const AcademicSection = require('../../../../models/academic/AcademicSection');
const StudentSemesterEnrollment = require('../../../../models/academic/StudentSemesterEnrollment');
const SemesterSubjectMapping = require('../../../../models/academic/SemesterSubjectMapping');
const FacultyProfile = require('../../../../models/academic/FacultyProfile');
const mongoose = require('mongoose');

/**
 * Resolves subjects for a section based on Subject Mapping
 */
exports.getSubjectsForSection = async (sectionId) => {
    const section = await AcademicSection.findById(sectionId);
    if (!section) throw new Error('Section not found');

    const mappings = await SemesterSubjectMapping.find({
        academicYearId: section.academicYearId,
        semesterId: section.semesterId,
        department: section.department,
        status: 'active'
    }).populate('subjectId', 'subjectName subjectCode');

    return mappings.map(m => m.subjectId);
};

/**
 * Resolves students for a section from Enrollment
 */
exports.getStudentsForSection = async (sectionId) => {
    return await StudentSemesterEnrollment.find({
        sectionId,
        enrollmentStatus: 'Active'
    }).populate({
        path: 'studentMasterId',
        select: 'studentId personalDetails academicProfile',
        populate: { path: 'userId', select: 'fullName' }
    });
};

/**
 * Marks attendance (Create Session + Entries)
 */
exports.markAttendance = async (sessionData, entriesData, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const attendanceSession = await AttendanceSession.create([
            { ...sessionData, createdBy: userId }
        ], { session });

        const entries = entriesData.map(entry => ({
            ...entry,
            sessionId: attendanceSession[0]._id
        }));

        await AttendanceEntry.insertMany(entries, { session });

        await session.commitTransaction();
        return attendanceSession[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Gets student attendance summary & subject-wise details
 */
exports.getStudentAttendanceStats = async (studentMasterId) => {
    // 1. Get all entries for this student
    const entries = await AttendanceEntry.find({ studentId: studentMasterId })
        .populate({
            path: 'sessionId',
            populate: [
                { path: 'subjectId', select: 'subjectName subjectCode' },
                { path: 'facultyId', populate: { path: 'user', select: 'fullName' } }
            ]
        });

    const stats = {
        total: entries.length,
        present: entries.filter(e => e.status === 'Present').length,
        absent: entries.filter(e => e.status === 'Absent').length,
        late: entries.filter(e => e.status === 'Late').length,
        excused: entries.filter(e => e.status === 'Excused').length,
        percentage: 0,
        subjectWise: {},
        history: entries
            .filter(e => e.sessionId && e.sessionId.subjectId)
            .map(e => ({
                date: e.sessionId.date,
                startTime: e.sessionId.startTime,
                endTime: e.sessionId.endTime,
                room: e.sessionId.room,
                remarks: e.sessionId.remarks,
                subject: e.sessionId.subjectId,
                status: e.status,
                sessionType: e.sessionId.sessionType,
                faculty: e.sessionId.facultyId?.user?.fullName
            })).sort((a, b) => b.date - a.date)
    };

    if (stats.total > 0) {
        stats.percentage = ((stats.present / stats.total) * 100).toFixed(2);
    }

    // Process subject-wise
    entries.forEach(e => {
        if (!e.sessionId || !e.sessionId.subjectId) return;
        
        const subId = e.sessionId.subjectId._id.toString();
        const subName = e.sessionId.subjectId.subjectName;
        
        if (!stats.subjectWise[subId]) {
            stats.subjectWise[subId] = { name: subName, total: 0, present: 0, percentage: 0 };
        }
        
        stats.subjectWise[subId].total++;
        if (e.status === 'Present') stats.subjectWise[subId].present++;
        stats.subjectWise[subId].percentage = ((stats.subjectWise[subId].present / stats.subjectWise[subId].total) * 100).toFixed(2);
    });

    return stats;
};

/**
 * Comprehensive Reports for HOD/Admin/Faculty
 */
exports.getAttendanceSessions = async (filters = {}, currentUser) => {
    let query = { ...filters };

    // RBAC for HOD
    if (currentUser.role === 'hod') {
        const hodProfile = await FacultyProfile.findOne({ user: currentUser.id });
        if (hodProfile) {
            const sections = await AcademicSection.find({ department: hodProfile.department }).select('_id');
            const sectionIds = sections.map(s => s._id);
            query.sectionId = { $in: sectionIds };
        }
    }

    return await AttendanceSession.find(query)
        .populate('academicYearId', 'name')
        .populate('semesterId', 'semesterName')
        .populate('sectionId', 'name')
        .populate('subjectId', 'subjectName subjectCode')
        .populate({
            path: 'facultyId',
            populate: { path: 'user', select: 'fullName' }
        })
        .sort({ date: -1 });
};
