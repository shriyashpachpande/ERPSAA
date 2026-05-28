const SemesterResultRecord = require('../../models/academic/SemesterResultRecord');
const InternalMarksRecord = require('../../models/academic/InternalMarksRecord');
const StudentSemesterEnrollment = require('../../models/academic/StudentSemesterEnrollment');
const gradingUtils = require('../../utils/academic/gradingUtils');

exports.generateSectionResults = async (context, operatorId) => {
  const { academicYearId, semesterId, sectionId } = context;

  // 1. Get all students enrolled in this section context
  const enrollments = await StudentSemesterEnrollment.find({
    academicYearId,
    semesterId,
    sectionId,
    enrollmentStatus: { $in: ['active', 'Active'] }
  });

  const generatedResults = [];

  for (const enrollment of enrollments) {
    const studentId = enrollment.studentMasterId;

    // 2. Fetch all marks for this student in this term
    const marks = await InternalMarksRecord.find({
      studentMasterId: studentId,
      academicYearId,
      semesterId,
      sectionId,
      marksStatus: { $in: ['Draft', 'Submitted', 'Locked'] }
    });

    if (marks.length === 0) continue;

    const subjectResults = marks.map(m => ({
      subjectId: m.subjectId,
      internalMarks: m.totalInternalMarks,
      totalMarks: m.totalInternalMarks,
      maxMarks: m.maxInternalMarks,
      status: m.totalInternalMarks >= (m.maxInternalMarks * 0.4) ? 'Pass' : 'Fail',
      grade: gradingUtils.calculateGrade(m.totalInternalMarks, m.maxInternalMarks)
    }));

    const grandTotal = subjectResults.reduce((acc, curr) => acc + curr.totalMarks, 0);
    const maxTotal = subjectResults.reduce((acc, curr) => acc + curr.maxMarks, 0);
    const percentage = maxTotal > 0 ? (grandTotal / maxTotal) * 100 : 0;
    const overallGrade = gradingUtils.calculateGrade(grandTotal, maxTotal);

    // 3. Upsert Result Record
    const resultDoc = await SemesterResultRecord.findOneAndUpdate(
      { studentId, academicYearId, semesterId },
      {
        sectionId,
        subjectResults,
        grandTotal,
        maxTotal,
        percentage,
        overallGrade,
        resultStatus: 'Generated',
        generatedBy: operatorId,
        updatedBy: operatorId
      },
      { upsert: true, new: true }
    );

    generatedResults.push(resultDoc);
  }

  return generatedResults;
};

exports.publishResults = async (academicYearId, semesterId, sectionId) => {
  return await SemesterResultRecord.updateMany(
    { academicYearId, semesterId, sectionId, resultStatus: 'Generated' },
    { resultStatus: 'Published', publishedAt: new Date() }
  );
};

exports.getStudentResults = async (query) => {
  const { studentId, academicYearId, semesterId, sectionId, resultStatus } = query;
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (academicYearId) filter.academicYearId = academicYearId;
  if (semesterId) filter.semesterId = semesterId;
  if (sectionId) filter.sectionId = sectionId;
  if (resultStatus) filter.resultStatus = resultStatus;

  return await SemesterResultRecord.find(filter)
    .populate('studentId', 'personalDetails studentId')
    .populate('academicYearId', 'name')
    .populate('semesterId', 'semesterName')
    .populate({
      path: 'subjectResults.subjectId',
      select: 'subjectName subjectCode'
    })
    .sort({ createdAt: -1 });
};
