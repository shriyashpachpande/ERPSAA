const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/auth/User');
const FacultyProfile = require('./models/academic/FacultyProfile');

dotenv.config({ path: path.join(__dirname, '../.env') });

const verify = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const csFacultyCount = await FacultyProfile.countDocuments({ department: 'CS' });
    console.log(`Total CS Faculty in FacultyProfile: ${csFacultyCount}`);

    const sampleFaculty = await FacultyProfile.findOne({ employeeId: 'EMP-FAC-CS-001' }).populate('user');
    if (sampleFaculty) {
      console.log('Sample Faculty Profile:');
      console.log(`- Name: ${sampleFaculty.user.fullName}`);
      console.log(`- Email: ${sampleFaculty.user.email}`);
      console.log(`- Department: ${sampleFaculty.department}`);
      console.log(`- Employee ID: ${sampleFaculty.employeeId}`);
    } else {
      console.log('Sample faculty EMP-FAC-CS-001 not found.');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

verify();
