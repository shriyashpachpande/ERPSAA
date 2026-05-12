const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Find user
    const email = 'amarnathkadam20261@erpsaa.com';
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    console.log('User ID:', user._id);

    // Find StudentMaster
    const studentMaster = await db.collection('studentmasters').findOne({ userId: user._id });
    if (!studentMaster) {
      console.log('StudentMaster not found');
      process.exit(1);
    }
    console.log('StudentMaster ID:', studentMaster._id);

    // Find Enrollment
    const enrollment = await db.collection('studentsemesterenrollments').findOne({ studentMasterId: studentMaster._id });
    if (!enrollment) {
      console.log('Enrollment not found');
      process.exit(1);
    }
    console.log('Enrollment:', enrollment);

    // Find Section
    const section = await db.collection('academicsections').findOne({ _id: enrollment.sectionId });
    if (!section) {
      console.log('Section not found');
      process.exit(1);
    }
    console.log('Section Context:', {
      dept: section.department,
      sem: section.semesterId,
      year: section.academicYearId
    });

    // Find Mappings
    const mappings = await db.collection('semestersubjectmappings').find({
      academicYearId: section.academicYearId,
      department: section.department,
      semesterId: section.semesterId
    }).toArray();

    console.log(`Found ${mappings.length} mappings`);
    for (const m of mappings) {
      const subject = await db.collection('academicsubjects').findOne({ _id: m.subjectId });
      console.log(`- ${subject?.subjectName} (${subject?.subjectCode})`);
    }

    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

debug();
