const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        const db = mongoose.connection.db;
        const count = await db.collection('attendanceentries').countDocuments();
        console.log(`Total Attendance Entries: ${count}`);
        
        const sample = await db.collection('attendanceentries').findOne();
        console.log('Sample Entry:', JSON.stringify(sample, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
