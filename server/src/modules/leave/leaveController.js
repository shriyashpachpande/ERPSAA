const LeaveRequest = require('./leaveRequest.model');
const LeaveHealthNotification = require('./notification.model');
const mongoose = require('mongoose');

// Shared department normalizer for matching variants
const getDeptRegexList = (dept) => {
    if (!dept) return [/^NON_EXISTENT$/i];
    const d = dept.toLowerCase().trim();
    if (d === 'it' || d === 'information technology') return [/^it$/i, /^information\s*technology$/i];
    if (d === 'cse' || d === 'computer science' || d === 'computer science and engineering') return [/^cse$/i, /^computer\s*science$/i, /^computer\s*science\s*and\s*engineering$/i];
    if (d === 'me' || d === 'mech' || d === 'mechanical' || d === 'mechanical engineering') return [/^me$/i, /^mech$/i, /^mechanical$/i, /^mechanical engineering$/i];
    if (d === 'ce' || d === 'civil' || d === 'civil engineering') return [/^ce$/i, /^civil$/i, /^civil engineering$/i];
    if (d === 'ee' || d === 'eee' || d === 'electrical' || d === 'electronics') return [/^ee$/i, /^eee$/i, /^electrical$/i, /^electronics$/i];
    return [new RegExp(`^${dept}$`, 'i')];
};

// @desc    Apply for leave
// @route   POST /api/leave/apply
// @access  Private (Student)
exports.createLeaveRequest = async (req, res) => {
    try {
        const { leaveType, fromDate, toDate, reason, document } = req.body;

        if (!req.user.studentMasterId) {
             return res.status(403).json({ success: false, error: 'Student profile not found.' });
        }

        // Leave Balance check
        const LeaveBalance = require('./leaveBalance.model');
        const dFrom = new Date(fromDate);
        const dTo = new Date(toDate);
        const duration = Math.ceil((dTo - dFrom) / (1000 * 60 * 60 * 24)) + 1;
        const currentYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

        let balance = await LeaveBalance.findOne({ studentId: req.user.studentMasterId, academicYear: currentYear });
        if (!balance) {
             balance = await LeaveBalance.create({ studentId: req.user.studentMasterId, academicYear: currentYear });
        }

        if (balance.remainingLeaves < duration) {
             return res.status(400).json({ success: false, error: 'Insufficient leave balance.' });
        }

        // Smart Abuse Detection (> 3 leaves in 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentLeaves = await LeaveRequest.countDocuments({
             studentId: req.user.studentMasterId,
             createdAt: { $gte: thirtyDaysAgo }
        });
        const isFlagged = recentLeaves >= 3;
        const flagReason = isFlagged ? 'Frequent leave requests within 30 days.' : undefined;

        // Medical Validation Setup
        const isMedical = leaveType === 'Medical';
        const level2Required = isMedical || duration > 3;

        const newLeave = await LeaveRequest.create({
            studentId: req.user.studentMasterId,
            leaveType,
            fromDate,
            toDate,
            reason,
            document,
            medicalProofUrl: isMedical ? document : undefined,
            isMedical,
            documentRequired: isMedical,
            level2Required,
            isFlagged,
            flagReason
        });

        // Notify only relevant department faculty/HOD
        try {
            const StudentMaster = mongoose.model('StudentMaster');
            const FacultyProfile = mongoose.model('FacultyProfile');
            
            const student = await StudentMaster.findById(req.user.studentMasterId);
            if (student && student.academicProfile && student.academicProfile.department) {
                const relevantStaff = await FacultyProfile.find({
                    department: { $in: getDeptRegexList(student.academicProfile.department) }
                });
                
                const notifications = relevantStaff.map(staff => ({
                    userId: staff.user,
                    title: 'New Leave Request',
                    message: `A new leave request was submitted by ${student.personalDetails?.fullName || 'a student'} from your department.`,
                    type: 'Leave'
                }));
                
                if (notifications.length > 0) {
                    await LeaveHealthNotification.insertMany(notifications);
                }
            }
        } catch (notifErr) {
            console.error('Error sending department notifications:', notifErr);
            // non-blocking
        }

        res.status(201).json({ success: true, data: newLeave });
    } catch (err) {
        console.error('Error creating leave:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get student's own leaves
// @route   GET /api/leave/student
// @access  Private (Student)
exports.getStudentLeaves = async (req, res) => {
    try {
        if (!req.user.studentMasterId) {
             return res.status(403).json({ success: false, error: 'Student profile not found.' });
        }

        const leaves = await LeaveRequest.find({ studentId: req.user.studentMasterId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    } catch (err) {
        console.error('Error fetching student leaves:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all leave requests
// @route   GET /api/leave/all
// @access  Private (Faculty, Admin)
exports.getAllLeaveRequests = async (req, res) => {
    try {
        let matchQuery = {};
        
        // Scope to department for faculty and HOD
        if (['faculty', 'hod'].includes(req.user.role)) {
            if (req.user.department) {
                matchQuery = { 'academicProfile.department': { $in: getDeptRegexList(req.user.department) } };
            } else {
                matchQuery = { 'academicProfile.department': 'NON_EXISTENT_DEPARTMENT' }; // Block if no department
            }
        }

        const leaves = await LeaveRequest.find()
            .populate({
                path: 'studentId',
                match: matchQuery,
                select: 'personalDetails.fullName studentId academicProfile.department academicProfile.course'
            })
            .sort({ createdAt: -1 });

        // Filter out nulls (requests from other departments that didn't match the populate query)
        const filteredLeaves = leaves.filter(leave => leave.studentId !== null);

        res.status(200).json({ success: true, count: filteredLeaves.length, data: filteredLeaves });
    } catch (err) {
        console.error('Error fetching all leaves:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get student leave balance
// @route   GET /api/leave/balance
// @access  Private (Student)
exports.getLeaveBalance = async (req, res) => {
    try {
        if (!req.user.studentMasterId) {
             return res.status(403).json({ success: false, error: 'Student profile not found.' });
        }
        const LeaveBalance = require('./leaveBalance.model');
        const currentYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
        
        let balance = await LeaveBalance.findOne({ studentId: req.user.studentMasterId, academicYear: currentYear });
        if (!balance) {
             // Create initial default if not exists
             balance = await LeaveBalance.create({ studentId: req.user.studentMasterId, academicYear: currentYear });
        }
        res.status(200).json({ success: true, data: balance });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update leave status (Multi-level)
// @route   PUT /api/leave/status
// @access  Private (Faculty, Admin, HOD)
exports.updateLeaveStatus = async (req, res) => {
    try {
        const { leaveId, action, remarks } = req.body; 
        // Expected action: 'Forwarded to HOD', 'Approved', 'Rejected'

        const leave = await LeaveRequest.findById(leaveId).populate('studentId');
        if (!leave) {
            return res.status(404).json({ success: false, error: 'Leave request not found' });
        }

        let newStatus = action; // For finalStatus matching legacy frontend
        
        if (action === 'Forwarded to HOD') {
             leave.approvalStage = 'Forwarded to HOD';
             leave.reviewedByFaculty = req.user._id;
             newStatus = 'Pending'; // final status stays pending
             
             // Notify HOD recursively
             try {
                 const FacultyProfile = mongoose.model('FacultyProfile');
                 if(leave.studentId && leave.studentId.academicProfile) {
                     const hods = await FacultyProfile.find({
                         department: { $in: getDeptRegexList(leave.studentId.academicProfile.department) },
                         designation: new RegExp('hod|head', 'i')
                     });
                     if (hods.length > 0) {
                         await LeaveHealthNotification.insertMany(hods.map(h => ({
                             userId: h.user,
                             title: 'Leave Forwarded for Final Approval',
                             message: `A leave request from ${leave.studentId.personalDetails?.fullName} requires HOD approval.`,
                             type: 'Leave'
                         })));
                     }
                 }
             } catch(e) {}
             
        } else if (action === 'Approved' || action === 'Rejected') {
             leave.approvalStage = action;
             leave.finalStatus = action;
             leave.status = action;
             
             if (req.user.role === 'hod' || req.user.role === 'admin') leave.reviewedByHod = req.user._id;
             else leave.reviewedByFaculty = req.user._id;
             leave.approvedBy = req.user._id;

             // Balance & Attendance processing on Approval
             if (action === 'Approved') {
                 const duration = Math.ceil((new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)) + 1;
                 const currentYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
                 const LeaveBalance = require('./leaveBalance.model');
                 
                 await LeaveBalance.findOneAndUpdate(
                     { studentId: leave.studentId._id, academicYear: currentYear },
                     { 
                         $inc: { 
                             usedLeaves: duration, 
                             remainingLeaves: -duration,
                             ...(leave.leaveType === 'Medical' ? { medicalLeavesUsed: duration } : {}),
                             ...(leave.leaveType === 'Casual' ? { casualLeavesUsed: duration } : {}),
                             ...(leave.leaveType === 'Emergency' ? { emergencyLeavesUsed: duration } : {})
                         }
                     }
                 );

                 // Safe Attendance Integration (Excusing Student for those dates)
                 try {
                     const AttendanceSession = mongoose.models.AttendanceSession;
                     const AttendanceEntry = mongoose.models.AttendanceEntry;
                     if(AttendanceSession && AttendanceEntry) {
                         const sessions = await AttendanceSession.find({
                             date: { $gte: new Date(leave.fromDate), $lte: new Date(leave.toDate) }
                         });
                         for(const s of sessions) {
                             await AttendanceEntry.findOneAndUpdate(
                                 { sessionId: s._id, studentId: leave.studentId._id },
                                 { status: 'Excused' },
                                 { upsert: true, new: true }
                             );
                         }
                     }
                 } catch(attnErr) {
                     console.error('Attendance Sync Error:', attnErr);
                 }
             }
        }

        if (remarks) leave.remarks = remarks;

        await leave.save();

        // Create notification for student
        if (leave.studentId && leave.studentId.userId && (action === 'Approved' || action === 'Rejected')) {
             await LeaveHealthNotification.create({
                 userId: leave.studentId.userId,
                 title: `Leave ${action}`,
                 message: `Your leave request from ${new Date(leave.fromDate).toLocaleDateString()} to ${new Date(leave.toDate).toLocaleDateString()} has been ${action.toLowerCase()}.`,
                 type: 'Leave'
             });
        }

        res.status(200).json({ success: true, data: leave });
    } catch (err) {
        console.error('Error updating leave status:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
