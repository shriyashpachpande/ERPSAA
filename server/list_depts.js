const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

async function debug() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  const departments = await db.collection('departments').find({}).toArray();
  fs.writeFileSync('depts_output.json', JSON.stringify(departments, null, 2));
  process.exit(0);
}

debug();
