const InternalMarksRecord = require('../../models/academic/InternalMarksRecord');
const FacultyAcademicAssignment = require('../../models/academic/FacultyAcademicAssignment');
const StudentSemesterEnrollment = require('../../models/academic/StudentSemesterEnrollment');

/**
 * Bulk create or update internal marks
 */
exports.bulkUpsertMarks = async (marksData, operatorId) => {
  // First verify all entries belong to the same context (Year, Sem, Sec, Sub)
  // And verify the faculty is allocated to this context
  if (marksData.length === 0) return [];

  const { academicYearId, semesterId, sectionId, subjectId, facultyProfileId } = marksData[0];

  const assignment = await FacultyAcademicAssignment.findOne({
    faculty: facultyProfileId,
    academicYearId,
    semesterId,
    sectionId,
    subjectId,
    assignmentStatus: 'active'
  });

  if (!assignment) {
    throw new Error('Faculty is not authorized for this specific academic context');
  }

  const results = [];
  for (const entry of marksData) {
    const filter = {
      studentMasterId: entry.studentMasterId,
      academicYearId: entry.academicYearId,
      semesterId: entry.semesterId,
      sectionId: entry.sectionId,
      subjectId: entry.subjectId
    };

    const update = {
      ...entry,
      facultyProfileId,
      updatedBy: operatorId,
      $setOnInsert: { createdBy: operatorId }
    };

    const doc = await InternalMarksRecord.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      runValidators: true
    });
    results.push(doc);
  }

  return results;
};

exports.getMarksRecords = async (query) => {
  const { academicYearId, semesterId, sectionId, subjectId, studentMasterId, marksStatus } = query;
  const filter = {};
  if (academicYearId) filter.academicYearId = academicYearId;
  if (semesterId) filter.semesterId = semesterId;
  if (sectionId) filter.sectionId = sectionId;
  if (subjectId) filter.subjectId = subjectId;
  if (studentMasterId) filter.studentMasterId = studentMasterId;
  if (marksStatus) filter.marksStatus = marksStatus;

  return await InternalMarksRecord.find(filter)
    .populate('studentMasterId', 'fullName rollNumber')
    .populate('subjectId', 'subjectName subjectCode')
    .sort({ createdAt: -1 });
};

exports.getStudentMarksSummary = async (studentMasterId) => {
  return await InternalMarksRecord.find({ studentMasterId, marksStatus: { $in: ['Submitted', 'Locked'] } })
    .populate('subjectId', 'subjectName subjectCode')
    .populate('semesterId', 'semesterName');
};
