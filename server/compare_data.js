const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    const mappings = await db.collection('semestersubjectmappings').find({}).toArray();
    console.log(`Total mappings: ${mappings.length}`);
    
    if (mappings.length > 0) {
      console.log('Sample Mapping:');
      console.log(JSON.stringify(mappings[0], null, 2));
    }

    const sections = await db.collection('academicsections').find({}).toArray();
    console.log(`Total sections: ${sections.length}`);
    if (sections.length > 0) {
      console.log('Sample Section:');
      console.log(JSON.stringify(sections[0], null, 2));
    }

    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

debug();
