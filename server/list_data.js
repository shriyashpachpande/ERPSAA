const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const StudentSemesterEnrollment = require('./src/models/academic/StudentSemesterEnrollment');
const User = require('./src/models/auth/User');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({ role: 'student' });
    console.log(`Found ${users.length} students:`);
    users.forEach(u => console.log(`- ${u.name} (${u.email}) [ID: ${u._id}]`));

    const enrollments = await StudentSemesterEnrollment.find({})
      .populate('studentId', 'name email')
      .populate('sectionId', 'sectionName');
    
    console.log(`\nFound ${enrollments.length} enrollments:`);
    enrollments.forEach(e => {
      console.log(`- Student: ${e.studentId?.name || 'Unknown'} (${e.studentId?.email || e.studentId})`);
      console.log(`  Section: ${e.sectionId?.sectionName || 'N/A'}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

debug();
