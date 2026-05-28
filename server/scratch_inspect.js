const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
    
    // Dynamically retrieve user schema
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const user = await User.findOne({ email: 'virajmathpati2022@erpsaa.com' });
    
    if (user) {
      console.log('USER RECORD IN DB:');
      console.log(JSON.stringify(user.toObject(), null, 2));
    } else {
      console.log('User not found in DB!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
