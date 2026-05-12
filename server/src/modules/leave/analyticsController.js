const LeaveRequest = require('./leaveRequest.model');
const HealthIncident = require('./healthIncident.model');
const StudentMaster = require('../../models/student-master/StudentMaster');

// @desc    Get leave analytics (Admin/HOD scoped)
// @route   GET /api/leave/analytics
// @access  Private (Admin, HOD)
exports.getAnalytics = async (req, res) => {
    try {
        let matchQuery = {};
        
        // Scope to department if HOD
        // Note: For advanced population querying, native aggregate is needed. We will simulate safely.
        // Actually, we can fetch all leaves matching dept.
        
        const leaves = await LeaveRequest.find().populate({
            path: 'studentId',
            select: 'academicProfile.department'
        });

        // Filter valid targets dependent on scope
        let scopedLeaves = leaves.filter(l => l.studentId !== null);
        
        if (req.user.role === 'hod' && req.user.department) {
             const d = req.user.department.toLowerCase().trim();
             const isMatch = (dept) => {
                 if (!dept) return false;
                 const target = dept.toLowerCase().trim();
                 if ((d === 'it' || d === 'information technology') && (target === 'it' || target === 'information technology')) return true;
                 if ((d === 'cse' || d === 'computer science') && (target === 'cse' || target === 'computer science' || target === 'computer science and engineering')) return true;
                 return d === target;
             }
             scopedLeaves = scopedLeaves.filter(l => isMatch(l.studentId?.academicProfile?.department));
        }

        // Basic Stats
        const totalRequests = scopedLeaves.length;
        const pending = scopedLeaves.filter(l => l.approvalStage === 'Pending' || l.finalStatus === 'Pending').length;
        const approved = scopedLeaves.filter(l => l.finalStatus === 'Approved').length;
        const rejected = scopedLeaves.filter(l => l.finalStatus === 'Rejected').length;

        // By Type
        const byType = {
            Casual: scopedLeaves.filter(l => l.leaveType === 'Casual').length,
            Medical: scopedLeaves.filter(l => l.leaveType === 'Medical').length,
            Emergency: scopedLeaves.filter(l => l.leaveType === 'Emergency').length,
        };

        // Flagged
        const flagged = scopedLeaves.filter(l => l.isFlagged).length;

        res.status(200).json({
            success: true,
            data: {
                totalRequests,
                pending,
                approved,
                rejected,
                byType,
                flagged
            }
        });

    } catch (err) {
        console.error('Analytics Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
