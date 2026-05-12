const HealthIncident = require('./healthIncident.model');
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

// @desc    Report new health incident
// @route   POST /api/health/report
// @access  Private (Faculty, Admin)
exports.reportIncident = async (req, res) => {
    try {
        const { studentId, incidentType, description, severity, dateTime } = req.body;

        const newIncident = await HealthIncident.create({
            studentId,
            incidentType,
            description,
            severity,
            dateTime: dateTime || Date.now(),
            reportedBy: req.user._id
        });

        // Notify relevant department staff + admins
        try {
            const StudentMaster = mongoose.model('StudentMaster');
            const FacultyProfile = mongoose.model('FacultyProfile');
            
            const student = await StudentMaster.findById(studentId);
            if (student && student.academicProfile && student.academicProfile.department) {
                const relevantStaff = await FacultyProfile.find({
                    department: { $in: getDeptRegexList(student.academicProfile.department) }
                });
                
                const notifications = relevantStaff.map(staff => ({
                    userId: staff.user,
                    title: `Health Incident: ${incidentType}`,
                    message: `A ${severity} severity health incident was reported for ${student.personalDetails?.fullName || 'a student'} in your department.`,
                    type: 'Health'
                }));
                
                if (notifications.length > 0) {
                    await LeaveHealthNotification.insertMany(notifications);
                }
            }
        } catch (notifErr) {
            console.error('Error sending health department notifications:', notifErr);
        }

        res.status(201).json({ success: true, data: newIncident });
    } catch (err) {
        console.error('Error reporting incident:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all health incidents
// @route   GET /api/health
// @access  Private (Faculty, Admin)
exports.getIncidents = async (req, res) => {
    try {
        let matchQuery = {};
        
        // Scope to department for faculty and HOD
        if (['faculty', 'hod'].includes(req.user.role)) {
            if (req.user.department) {
                matchQuery = { 'academicProfile.department': { $in: getDeptRegexList(req.user.department) } };
            } else {
                matchQuery = { 'academicProfile.department': 'NON_EXISTENT_DEPARTMENT' };
            }
        }

        const incidents = await HealthIncident.find()
            .populate({
                path: 'studentId',
                match: matchQuery,
                select: 'personalDetails.fullName studentId academicProfile.department'
            })
            .populate('reportedBy', 'firstName lastName')
            .sort({ dateTime: -1 });

        // Filter out nulls from other departments
        const filteredIncidents = incidents.filter(inc => inc.studentId !== null);

        res.status(200).json({ success: true, count: filteredIncidents.length, data: filteredIncidents });
    } catch (err) {
        console.error('Error fetching incidents:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update health incident status/resolution
// @route   PUT /api/health/:id
// @access  Private (Staff/Admin)
exports.updateIncidentStatus = async (req, res) => {
    try {
        const { status, severity, resolutionNotes } = req.body;
        
        const incident = await HealthIncident.findById(req.params.id);
        if(!incident) return res.status(404).json({ success: false, error: 'Incident not found' });
        
        if (status) incident.status = status;
        if (severity) incident.severity = severity;
        if (resolutionNotes) incident.resolutionNotes = resolutionNotes;
        
        if (status === 'Closed' && incident.status !== 'Closed') {
            incident.closedBy = req.user._id;
            incident.closedAt = Date.now();
        }
        
        await incident.save();
        
        res.status(200).json({ success: true, data: incident });
    } catch(err) {
        console.error('Error updating incident:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
