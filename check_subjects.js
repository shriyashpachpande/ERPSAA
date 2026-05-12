const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AcademicSubject = require('./server/src/models/academic/AcademicSubject');

dotenv.config({ path: './server/.env' });

const checkSubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB\n');

        const subjects = await AcademicSubject.find({ subjectCode: /BTBS/i });
        console.log(`Found ${subjects.length} subjects matching BTBS:`);
        subjects.forEach(s => {
            console.log(`- Name: ${s.subjectName}, Code: ${s.subjectCode}, Dept: ${s.department}, Status: ${s.status}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSubjects();
