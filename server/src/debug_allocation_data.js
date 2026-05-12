const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AcademicSubject = require('./models/academic/AcademicSubject');
const AcademicSection = require('./models/academic/AcademicSection');
const SemesterSubjectMapping = require('./models/academic/SemesterSubjectMapping');

dotenv.config({ path: '.env' });

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const deptsInSubjects = await AcademicSubject.distinct('department');
        console.log('Departments in AcademicSubject:', deptsInSubjects);

        const deptsInSections = await AcademicSection.distinct('department');
        console.log('Departments in AcademicSection:', deptsInSections);

        const deptsInMappings = await SemesterSubjectMapping.distinct('department');
        console.log('Departments in SemesterSubjectMapping:', deptsInMappings);

        const subjects = await AcademicSubject.find().limit(5);
        console.log('Sample Subjects:', subjects.map(s => ({ name: s.subjectName, dept: s.department })));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();
