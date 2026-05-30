const InternalMarksRecord = require('../../models/academic/InternalMarksRecord');
const FacultyAcademicAssignment = require('../../models/academic/FacultyAcademicAssignment');
const StudentSemesterEnrollment = require('../../models/academic/StudentSemesterEnrollment');

/**
 * Bulk create or update internal marks
 */
exports.bulkUpsertMarks = async (marksData, operatorId, operatorRole) => {
  // First verify all entries belong to the same context (Year, Sem, Sec, Sub)
  // And verify the faculty is allocated to this context
  if (marksData.length === 0) return [];

  const { academicYearId, semesterId, sectionId, subjectId, facultyProfileId } = marksData[0];

  let resolvedFacultyProfileId = facultyProfileId;

  // Resolve faculty profile if not provided (especially for administrators/HODs)
  if (!resolvedFacultyProfileId) {
    const assignment = await FacultyAcademicAssignment.findOne({
      academicYearId,
      semesterId,
      sectionId,
      subjectId,
      assignmentStatus: 'active'
    });
    if (assignment) {
      resolvedFacultyProfileId = assignment.faculty;
    } else {
      const FacultyProfile = require('../../models/academic/FacultyProfile');
      const faculty = await FacultyProfile.findOne({ userId: operatorId });
      if (faculty) {
        resolvedFacultyProfileId = faculty._id;
      }
    }
  }

  // Bypass assignment check for Admin and HOD roles
  const isAdministrative = ['super_admin', 'academic_admin', 'hod'].includes(operatorRole);

  if (!isAdministrative) {
    if (!resolvedFacultyProfileId) {
      const FacultyProfile = require('../../models/academic/FacultyProfile');
      const faculty = await FacultyProfile.findOne({ userId: operatorId });
      if (faculty) {
        resolvedFacultyProfileId = faculty._id;
      }
    }

    const assignment = await FacultyAcademicAssignment.findOne({
      faculty: resolvedFacultyProfileId,
      academicYearId,
      semesterId,
      sectionId,
      subjectId,
      assignmentStatus: 'active'
    });

    if (!assignment) {
      throw new Error('Faculty is not authorized for this specific academic context');
    }
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

    let entryResolvedFacultyId = resolvedFacultyProfileId;
    if (!entryResolvedFacultyId) {
      const existingRecord = await InternalMarksRecord.findOne(filter);
      if (existingRecord) {
        entryResolvedFacultyId = existingRecord.facultyProfileId;
      }
    }

    if (!entryResolvedFacultyId) {
      throw new Error('No active faculty allocation found for this subject and section. Please allocate a faculty to this subject first.');
    }

    const totalInternalMarks = (entry.pt1Marks || 0) + 
                               (entry.mseMarks || 0) + 
                               (entry.pt2Marks || 0) + 
                               (entry.semMarks || 0);

    const update = {
      ...entry,
      totalInternalMarks,
      maxInternalMarks: 120,
      facultyProfileId: entryResolvedFacultyId,
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

  const records = await InternalMarksRecord.find(filter)
    .populate('studentMasterId', 'personalDetails studentId')
    .populate('subjectId', 'subjectName subjectCode');

  // Sort the marks records to match the exact enrollment sequence of students in the section
  if (sectionId) {
    const StudentSemesterEnrollment = require('../../models/academic/StudentSemesterEnrollment');
    const enrollments = await StudentSemesterEnrollment.find({ sectionId })
      .select('studentMasterId')
      .sort({ createdAt: 1 });

    const studentOrderMap = {};
    enrollments.forEach((e, idx) => {
      if (e.studentMasterId) {
        studentOrderMap[e.studentMasterId.toString()] = idx;
      }
    });

    records.sort((a, b) => {
      const idxA = studentOrderMap[a.studentMasterId?._id?.toString()] ?? 99999;
      const idxB = studentOrderMap[b.studentMasterId?._id?.toString()] ?? 99999;
      return idxA - idxB;
    });
  } else {
    // Fallback sorting by internal mark record creation ascending
    records.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  return records;
};

exports.getStudentMarksSummary = async (studentMasterId) => {
  return await InternalMarksRecord.find({ studentMasterId, marksStatus: { $in: ['Draft', 'Submitted', 'Locked'] } })
    .populate('subjectId', 'subjectName subjectCode')
    .populate('semesterId', 'semesterName');
};
