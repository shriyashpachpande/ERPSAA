const StudentMaster = require('../../models/student-master/StudentMaster');
const IssueTransaction = require('../../models/library-management/issueTransactions.model');
const StudentFeeAccount = require('../../models/fees-management/StudentFeeAccount');
const AcademicTimetableEntry = require('../../models/academic/AcademicTimetableEntry');
const ComplaintTicket = require('../../models/complaint-management/complaintTicketModel');
const Notification = require('../../models/Notification');
const AttendanceEntry = require('../../modules/academic/attendance/models/AttendanceEntry');
const LeaveRequest = require('../../modules/leave/leaveRequest.model');
const StudentSemesterEnrollment = require('../../models/academic/StudentSemesterEnrollment');

exports.getStudentDashboardData = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        
        // 1. Get Student Profile
        const student = await StudentMaster.findOne({ userId }).populate('userId', 'fullName profileImage');
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student profile not found' });
        }

        const studentId = student._id;

        // 2. Attendance Stats
        const attendanceEntries = await AttendanceEntry.find({ studentId });
        const totalSessions = attendanceEntries.length;
        const presentSessions = attendanceEntries.filter(e => e.status === 'Present').length;
        const attendancePercentage = totalSessions > 0 ? ((presentSessions / totalSessions) * 100).toFixed(1) : 0;

        // 3. Library Stats
        const activeIssues = await IssueTransaction.find({ 
            studentId, 
            status: { $in: ['ISSUED', 'OVERDUE'] } 
        }).populate('bookId', 'title author');

        // 4. Fee Stats
        const feeAccount = await StudentFeeAccount.findOne({ studentId });
        const feesPaid = feeAccount ? feeAccount.totalPaid : 0;
        const feesBalance = feeAccount ? feeAccount.balance : 0;

        // 5. Leave Stats
        let activeLeaves = 0;
        try {
             activeLeaves = await LeaveRequest.countDocuments({ 
                studentId, 
                status: 'Approved',
                toDate: { $gte: new Date() }
            });
        } catch (e) {
            // If model doesn't exist or different name
            activeLeaves = 0;
        }

        // 6. Timetable for Today
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayDay = days[new Date().getDay()];
        
        const currentEnrollment = await StudentSemesterEnrollment.findOne({ 
            studentMasterId: studentId, 
            enrollmentStatus: 'Active' 
        });

        let timetable = [];
        if (currentEnrollment && currentEnrollment.sectionId) {
            timetable = await AcademicTimetableEntry.find({
                sectionId: currentEnrollment.sectionId,
                dayOfWeek: todayDay
            }).populate('subjectId', 'subjectName subjectCode')
              .sort({ startTime: 1 });
        }

        // 7. Recent Activity (Combined)
        const recentComplaints = await ComplaintTicket.find({ studentId: userId }).sort({ createdAt: -1 }).limit(3);
        const recentLibrary = await IssueTransaction.find({ studentId }).sort({ createdAt: -1 }).limit(3).populate('bookId', 'title');
        
        const activities = [
            ...recentComplaints.map(c => ({
                id: c._id,
                type: 'complaint',
                title: `Complaint #${c.complaintCode} ${c.status}`,
                time: c.createdAt,
                icon: 'MessageSquare',
                color: 'blue'
            })),
            ...recentLibrary.map(l => ({
                id: l._id,
                type: 'library',
                title: `"${l.bookId?.title}" ${l.status.toLowerCase()}`,
                time: l.updatedAt,
                icon: 'BookOpen',
                color: 'green'
            }))
        ].sort((a, b) => b.time - a.time).slice(0, 5);

        // 8. Notifications / Notices
        const notices = await Notification.find({ 
            $or: [
                { recipientType: 'all' },
                { recipientType: 'student' },
                { recipients: userId }
            ]
        }).sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            success: true,
            data: {
                student: {
                    name: student.personalDetails?.fullName || req.user.fullName,
                    studentId: student.studentId,
                    course: student.academicProfile?.course,
                    department: student.academicProfile?.department,
                    year: student.academicProfile?.yearNumber,
                    semester: student.academicProfile?.semester,
                    profileImage: student.userId?.profileImage
                },
                stats: {
                    attendance: attendancePercentage,
                    booksIssued: activeIssues.length,
                    feesPaid: feesPaid,
                    feesBalance: feesBalance,
                    activeLeaves: activeLeaves
                },
                library: {
                    currentIssued: activeIssues.map(i => ({
                        id: i._id,
                        title: i.bookId?.title,
                        author: i.bookId?.author,
                        dueDate: i.dueDate,
                        status: i.status
                    })),
                    history: [] // Simplified for now
                },
                charts: {
                    attendanceTrend: await getAttendanceTrend(studentId),
                    libraryUsage: await getLibraryUsage(studentId),
                    leaveStatus: await getLeaveStatus(studentId)
                },
                timetable: timetable.map(t => ({
                    id: t._id,
                    subject: t.subjectId?.subjectName,
                    code: t.subjectId?.subjectCode,
                    time: `${t.startTime} - ${t.endTime}`,
                    room: t.roomNumber,
                    type: t.type
                })),
                activities,
                notices: notices.map(n => ({
                    id: n._id,
                    title: n.title,
                    message: n.message,
                    time: n.createdAt,
                    type: n.type || 'info'
                }))
            }
        });

    } catch (error) {
        console.error('Student Dashboard Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

async function getAttendanceTrend(studentId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const AttendanceEntry = require('../../modules/academic/attendance/models/AttendanceEntry');
    
    const entries = await AttendanceEntry.find({ 
        studentId,
        createdAt: { $gte: thirtyDaysAgo }
    }).populate('sessionId', 'date');

    const grouped = entries.reduce((acc, entry) => {
        if (!entry.sessionId) return acc;
        const dateStr = new Date(entry.sessionId.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        if (!acc[dateStr]) acc[dateStr] = { total: 0, present: 0 };
        acc[dateStr].total++;
        if (entry.status === 'Present') acc[dateStr].present++;
        return acc;
    }, {});

    return Object.keys(grouped).map(date => ({
        name: date,
        value: Math.round((grouped[date].present / grouped[date].total) * 100)
    })).sort((a, b) => new Date(a.name) - new Date(b.name)).slice(-10);
}

async function getLibraryUsage(studentId) {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const IssueTransaction = require('../../models/library-management/issueTransactions.model');
    
    const transactions = await IssueTransaction.find({
        studentId,
        createdAt: { $gte: sixtyDaysAgo }
    });

    const grouped = transactions.reduce((acc, tx) => {
        const date = new Date(tx.createdAt);
        const weekNum = Math.ceil(date.getDate() / 7);
        const label = `Week ${weekNum}`;
        acc[label] = (acc[label] || 0) + 1;
        return acc;
    }, {});

    return Object.keys(grouped).map(label => ({
        name: label,
        value: grouped[label]
    })).slice(-5);
}

async function getLeaveStatus(studentId) {
    const LeaveRequest = require('../../modules/leave/leaveRequest.model');
    const stats = await LeaveRequest.aggregate([
        { $match: { studentId } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statusMap = { Approved: 0, Pending: 0, Rejected: 0 };
    stats.forEach(s => { if(statusMap.hasOwnProperty(s._id)) statusMap[s._id] = s.count; });

    return [
        { name: 'Approved', value: statusMap.Approved, color: '#10b981' },
        { name: 'Pending', value: statusMap.Pending, color: '#f59e0b' },
        { name: 'Rejected', value: statusMap.Rejected, color: '#ef4444' },
    ];
}
