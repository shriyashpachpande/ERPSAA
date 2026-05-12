const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const StudentSemesterEnrollment = require('./server/src/models/academic/StudentSemesterEnrollment');
const AcademicSection = require('./server/src/models/academic/AcademicSection');
const SemesterSubjectMapping = require('./server/src/models/academic/SemesterSubjectMapping');
const AcademicYear = require('./server/src/models/academic/AcademicYear');
const Semester = require('./server/src/models/academic/Semester');
const User = require('./server/src/models/User');

async function debug() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const studentEmail = 'amarnathkadam20261@erpsaa.com';
  const user = await User.findOne({ email: studentEmail });
  
  if (!user) {
    console.log('Student user not found');
    process.exit(1);
  }
  console.log('Student User ID:', user._id);

  const enrollment = await StudentSemesterEnrollment.findOne({ studentId: user._id })
    .populate('sectionId')
    .populate('academicYearId')
    .populate('semesterId');

  if (!enrollment) {
    console.log('Enrollment not found for student');
    process.exit(1);
  }

  console.log('Enrollment found:');
  console.log('- Section:', enrollment.sectionId?.sectionName || 'N/A');
  console.log('- Department:', enrollment.sectionId?.department || 'N/A');
  console.log('- Semester:', enrollment.semesterId?.semesterName || 'N/A');
  console.log('- Academic Year:', enrollment.academicYearId?.name || 'N/A');

  if (enrollment.sectionId) {
    const section = enrollment.sectionId;
    console.log('\nSection Details (Source of Truth):');
    console.log('- Dept:', section.department);
    console.log('- Sem ID:', section.semesterId);
    console.log('- Year ID:', section.academicYearId);

    const mappings = await SemesterSubjectMapping.find({
      academicYearId: section.academicYearId,
      department: section.department,
      semesterId: section.semesterId
    }).populate('subjectId');

    console.log(`\nFound ${mappings.length} subject mappings for this context:`);
    mappings.forEach(m => {
      console.log(`- ${m.subjectId?.subjectName} (${m.subjectId?.subjectCode})`);
    });
  }

  process.exit(0);
}

debug().catch(err => {
  console.error(err);
  process.exit(1);
});
