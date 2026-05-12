const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const StudentMaster = require('./src/models/student-master/StudentMaster');
const StudentSemesterEnrollment = require('./src/models/academic/StudentSemesterEnrollment');
const AcademicSection = require('./src/models/academic/AcademicSection');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'amarnathkadam20261@erpsaa.com';
    const sm = await StudentMaster.findOne({ 'contactDetails.email': email });
    console.log('StudentMaster ID:', sm._id);
    console.log('StudentMaster Dept:', sm.academicProfile.department);

    const enrollment = await StudentSemesterEnrollment.findOne({ studentMasterId: sm._id }).sort({ createdAt: -1 });
    console.log('Enrollment Section ID:', enrollment.sectionId);

    const section = await AcademicSection.findById(enrollment.sectionId);
    console.log('Section Name:', section.name);
    console.log('Section Dept:', section.department);

    process.exit(0);
  } catch (err) {
    console.error('Debug failed:', err);
    process.exit(1);
  }
}

debug();
