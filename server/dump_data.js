const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

async function debug() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  const mapping = await db.collection('semestersubjectmappings').findOne({});
  const section = await db.collection('academicsections').findOne({});

  const output = {
    mapping,
    section
  };

  fs.writeFileSync('dump_output.json', JSON.stringify(output, null, 2));
  process.exit(0);
}

debug();
