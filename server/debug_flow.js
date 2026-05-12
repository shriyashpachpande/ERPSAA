const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const StudentSemesterEnrollment = require('./src/models/academic/StudentSemesterEnrollment');
const StudentMaster = require('./src/models/student-master/StudentMaster');
const User = require('./src/models/auth/User');
const AcademicSection = require('./src/models/academic/AcademicSection');
const SemesterSubjectMapping = require('./src/models/academic/SemesterSubjectMapping');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'amarnathkadam20261@erpsaa.com';
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }
    console.log(`User ID: ${user._id}, Name: ${user.name}`);

    const studentMaster = await StudentMaster.findOne({ userId: user._id });
    if (!studentMaster) {
      console.log(`StudentMaster not found for user ID: ${user._id}`);
      process.exit(1);
    }
    console.log(`StudentMaster ID: ${studentMaster._id}, Student ID: ${studentMaster.studentId}`);

    const enrollment = await StudentSemesterEnrollment.findOne({ studentMasterId: studentMaster._id })
      .populate('academicYearId', 'name')
      .populate('semesterId', 'semesterName')
      .populate('sectionId');

    if (!enrollment) {
      console.log(`Enrollment not found for studentMaster ID: ${studentMaster._id}`);
      process.exit(1);
    }

    console.log('\nEnrollment Details:');
    console.log('- Year:', enrollment.academicYearId?.name);
    console.log('- Semester:', enrollment.semesterId?.semesterName);
    console.log('- Section:', enrollment.sectionId?.sectionName);

    if (enrollment.sectionId) {
      const section = enrollment.sectionId;
      console.log('\nSection Context (Source of Truth):');
      console.log('- Department:', section.department);
      console.log('- Semester ID:', section.semesterId);
      console.log('- Academic Year ID:', section.academicYearId);

      const mappings = await SemesterSubjectMapping.find({
        academicYearId: section.academicYearId,
        department: section.department,
        semesterId: section.semesterId
      }).populate('subjectId');

      console.log(`\nFound ${mappings.length} Subject Mappings:`);
      mappings.forEach(m => {
        console.log(`- ${m.subjectId?.subjectName} (${m.subjectId?.subjectCode})`);
      });

      if (mappings.length === 0) {
          console.log('\nDEBUG: No mappings found. Let\'s see what mappings exist for this dept.');
          const deptMappings = await SemesterSubjectMapping.find({ department: section.department })
            .populate('academicYearId', 'name')
            .populate('semesterId', 'semesterName');
          console.log(`Total mappings for dept "${section.department}": ${deptMappings.length}`);
          deptMappings.forEach(m => {
              console.log(`- Year: ${m.academicYearId?.name}, Sem: ${m.semesterId?.semesterName}, Sub: ${m.subjectId}`);
          });
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

debug();
