const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const FacultyProfile = require('./models/academic/FacultyProfile');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const idsToCheck = Array.from({ length: 21 }, (_, i) => `EMP-FAC-CS-${String(i + 1).padStart(3, '0')}`);
    const existingProfiles = await FacultyProfile.find({ employeeId: { $in: idsToCheck } });
    if (existingProfiles.length > 0) {
      console.log('Conflicting Employee IDs found:');
      existingProfiles.forEach(p => console.log(`- ${p.employeeId} (${p.department})`));
    } else {
      console.log('No conflicting Employee IDs found.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkIds();
