const mongoose = require('mongoose');
const AcademicSubject = require('./models/academic/AcademicSubject');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const subjects = await AcademicSubject.find({ subjectCode: 'BTBS101' });
        console.log(JSON.stringify(subjects, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
