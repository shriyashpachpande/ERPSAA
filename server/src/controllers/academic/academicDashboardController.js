const dashboardService = require('../../services/academic/academicDashboardService');
const FacultyProfile = require('../../models/academic/FacultyProfile');
const StudentMaster = require('../../models/student-master/StudentMaster'); 

exports.getAcademicDashboard = async (req, res) => {
  try {
    const role = req.user.role;
    let stats = {};

    if (role === 'super_admin' || role === 'academic_admin') {
      stats = await dashboardService.getAdminStats();
    } else if (role === 'hod') {
      const faculty = await FacultyProfile.findOne({ user: req.user.id });
      if (faculty) {
        stats = await dashboardService.getHODStats(faculty.department);
      }
    } else if (role === 'faculty') {
      const faculty = await FacultyProfile.findOne({ user: req.user.id });
      if (faculty) {
        stats = await dashboardService.getFacultyStats(faculty._id);
      }
    } else if (role === 'student') {
      // Find student linked to this user
      // Note: Reusing StudentMaster from previous module
      // Assuming user ID is stored in StudentMaster (Pattern A consistency)
      const student = await StudentMaster.findOne({ user: req.user.id });
      if (student) {
        stats = await dashboardService.getStudentStats(student._id);
      }
    }

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getQuickActions = async (req, res) => {
  // Return different actions based on role
  const role = req.user.role;
  let actions = [];

  if (role === 'super_admin' || role === 'academic_admin') {
    actions = [
      { id: 1, label: 'Add Academic Year', path: '/app/academic/years', icon: 'Calendar' },
      { id: 2, label: 'Generate Results', path: '/app/academic/results', icon: 'FileText' },
      { id: 3, label: 'Manage All Enrollments', path: '/app/academic/enrollments', icon: 'Users' }
    ];
  } else if (role === 'hod') {
    actions = [
      { id: 5, label: 'Manage Faculty', path: '/app/academic/faculty-details', icon: 'Users' },
      { id: 6, label: 'Section Overview', path: '/app/academic/sections', icon: 'LayoutGrid' },
      { id: 7, label: 'Department Subjects', path: '/app/academic/subjects', icon: 'BookOpen' },
      { id: 8, label: 'Review Internal Marks', path: '/app/academic/internal-marks', icon: 'CheckCircle' }
    ];
  } else if (role === 'faculty') {
    actions = [
      { id: 10, label: 'Enter Internal Marks', path: '/app/academic/internal-marks', icon: 'Edit' },
      { id: 11, label: 'View My Timetable', path: '/app/academic/my-faculty-timetable', icon: 'Clock' }
    ];
  } else if (role === 'student') {
    actions = [
      { id: 20, label: 'View My Result', path: '/app/student/my-results', icon: 'FileText' },
      { id: 21, label: 'My Class Timetable', path: '/app/student/my-timetable', icon: 'Clock' }
    ];
  }

  res.status(200).json({ success: true, data: actions });
};
