const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../../models/auth/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const createEventTeacher = async () => {
  try {
    await connectDB();

    const existingTeacher = await User.findOne({ email: 'sport_teacher@erpsaa.com' });
    if (existingTeacher) {
      console.log('Sport Teacher already exists.');
      process.exit();
    }

    const teacher = await User.create({
      fullName: 'R. K. Rathod',
      email: 'sport_teacher@erpsaa.com',
      username: 'sport_teacher',
      password: 'password123',
      role: 'sport_teacher',
      isActive: true,
      mustChangePassword: false
    });

    console.log(`Sport Teacher created with email: ${teacher.email}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createEventTeacher();
