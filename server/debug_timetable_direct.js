const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const TimetableEntry = require('./src/models/academic/AcademicTimetableEntry');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const sectionId = '69d6207902349ac469f5746a';
    
    // 3. Find by sectionId (as ObjectId)
    const entriesByObjectId = await TimetableEntry.find({ sectionId: new mongoose.Types.ObjectId(sectionId) });
    console.log(`Entries for section "${sectionId}" (ObjectId):`, entriesByObjectId.length);

    if (entriesByObjectId.length > 0) {
      console.log('Sample entry:', JSON.stringify(entriesByObjectId[0], null, 2));
      console.log('All entries summary:');
      entriesByObjectId.forEach(e => {
        // Log all fields to see if there's any hidden status field
        console.log(`- ${e.dayOfWeek} ${e.startTime}: ${e._id} | Fields: ${Object.keys(e.toObject()).join(', ')}`);
        // Specifically check for common status field names
        console.log(`  status: ${e.status}, timetableStatus: ${e.timetableStatus}, isActive: ${e.isActive}`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('Debug failed:', err);
    process.exit(1);
  }
}

debug();
