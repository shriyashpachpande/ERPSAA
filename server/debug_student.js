const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const StudentSemesterEnrollment = require('./src/models/academic/StudentSemesterEnrollment');
const AcademicSection = require('./src/models/academic/AcademicSection');
const SemesterSubjectMapping = require('./src/models/academic/SemesterSubjectMapping');
const AcademicYear = require('./src/models/academic/AcademicYear');
const Semester = require('./src/models/academic/Semester');
const User = require('./src/models/auth/User');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const studentEmail = 'amarnathkadam20261@erpsaa.com';
    const user = await User.findOne({ email: studentEmail });
    
    if (!user) {
      console.log('Student user not found');
      process.exit(1);
    }
    console.log('Student User ID:', user._id);
    console.log('Student Name:', user.name);
    console.log('Student Role:', user.role);

    const enrollment = await StudentSemesterEnrollment.findOne({ studentId: user._id })
      .populate('sectionId')
      .populate('academicYearId')
      .populate('semesterId');

    if (!enrollment) {
      console.log('Enrollment not found for student');
      // Let's check all enrollments
      const all = await StudentSemesterEnrollment.find({});
      console.log(`Total enrollments in DB: ${all.length}`);
      if (all.length > 0) {
          console.log('First enrollment studentId:', all[0].studentId);
      }
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
      
      if (mappings.length === 0) {
          console.log('\nDEBUG MAPPINGS:');
          const allMappings = await SemesterSubjectMapping.find({});
          console.log(`Total mappings in DB: ${allMappings.length}`);
          if (allMappings.length > 0) {
              console.log('Sample Mapping Context:', {
                  year: allMappings[0].academicYearId,
                  dept: allMappings[0].department,
                  sem: allMappings[0].semesterId
              });
          }
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

debug();
