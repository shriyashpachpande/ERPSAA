const AcademicYear = require('../../models/academic/AcademicYear');
const Semester = require('../../models/academic/Semester');
const AcademicSubject = require('../../models/academic/AcademicSubject');
const AcademicSection = require('../../models/academic/AcademicSection');
const FacultyAcademicAssignment = require('../../models/academic/FacultyAcademicAssignment');
const StudentSemesterEnrollment = require('../../models/academic/StudentSemesterEnrollment');
const InternalMarksRecord = require('../../models/academic/InternalMarksRecord');
const SemesterResultRecord = require('../../models/academic/SemesterResultRecord');

exports.getAdminStats = async () => {
  const [years, semesters, subjects, sections, facultyAllocations, totalEnrollments] = await Promise.all([
    AcademicYear.countDocuments(),
    Semester.countDocuments({ status: 'Active' }),
    AcademicSubject.countDocuments(),
    AcademicSection.countDocuments(),
    FacultyAcademicAssignment.countDocuments({ assignmentStatus: 'active' }),
    StudentSemesterEnrollment.countDocuments({ enrollmentStatus: 'active' })
  ]);

  const pendingMarks = await InternalMarksRecord.countDocuments({ marksStatus: 'Draft' });

  return {
    years,
    semesters,
    subjects,
    sections,
    facultyAllocations,
    totalEnrollments,
    pendingMarks
  };
};

exports.getFacultyStats = async (facultyProfileId) => {
  const assignments = await FacultyAcademicAssignment.find({ faculty: facultyProfileId, assignmentStatus: 'active' })
    .populate('subjectId', 'subjectName')
    .populate('sectionId', 'name');

  const marksSummary = await InternalMarksRecord.aggregate([
    { $match: { facultyProfileId } },
    { $group: { _id: "$marksStatus", count: { $sum: 1 } } }
  ]);

  return {
    activeAssignments: assignments,
    marksSummary: marksSummary.reduce((acc, curr) => { acc[curr._id] = curr.count; return acc; }, {})
  };
};

exports.getStudentStats = async (studentId) => {
  const currentEnrollment = await StudentSemesterEnrollment.findOne({ studentMasterId: studentId, enrollmentStatus: 'Active' })
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterName')
    .populate('sectionId', 'name');

  const latestResult = await SemesterResultRecord.findOne({ studentId, resultStatus: 'Published' })
    .sort({ createdAt: -1 });

  const recentMarks = await InternalMarksRecord.find({ studentMasterId: studentId, marksStatus: { $in: ['Submitted', 'Locked'] } })
    .populate('subjectId', 'subjectName')
    .limit(5);

  return {
    enrollment: currentEnrollment,
    latestResult,
    recentMarks
  };
};

exports.getHODStats = async (department) => {
  const StudentMaster = require('../../models/student-master/StudentMaster');

  const [totalStudents, subjects, semesters, draftMarksRecords] = await Promise.all([
    // Active Students in Department
    StudentMaster.countDocuments({ 
      'academicProfile.department': department,
      'enrollmentStatus': 'active' 
    }),
    // Subjects in Department
    AcademicSubject.countDocuments({ 
      department: department,
      status: 'active'
    }),
    // Active Semesters (Global)
    Semester.countDocuments({ status: 'Active' }),
    // Draft Marks in Department - Using aggregation to filter by subject's department
    InternalMarksRecord.aggregate([
      {
        $lookup: {
          from: 'academicsubjects', // MongoDB collection name for AcademicSubject
          localField: 'subjectId',
          foreignField: '_id',
          as: 'subject'
        }
      },
      { $unwind: '$subject' },
      {
        $match: {
          'marksStatus': 'Draft',
          'subject.department': department
        }
      },
      { $count: 'count' }
    ])
  ]);

  return {
    totalEnrollments: totalStudents,
    subjects,
    semesters,
    pendingMarks: draftMarksRecords[0]?.count || 0
  };
};
