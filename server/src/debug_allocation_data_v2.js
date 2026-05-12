const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const AcademicSubject = require('./models/academic/AcademicSubject');
const AcademicSection = require('./models/academic/AcademicSection');
const SemesterSubjectMapping = require('./models/academic/SemesterSubjectMapping');
const FacultyProfile = require('./models/academic/FacultyProfile');

dotenv.config({ path: '.env' });

const debug = async () => {
    let output = '';
    const log = (msg) => { output += msg + '\n'; console.log(msg); };

    try {
        await mongoose.connect(process.env.MONGO_URI);
        log('Connected to DB');

        const subjects = await AcademicSubject.distinct('department');
        log(`\nDepartments in AcademicSubject: ${JSON.stringify(subjects)}`);

        const sections = await AcademicSection.distinct('department');
        log(`Departments in AcademicSection: ${JSON.stringify(sections)}`);

        const mappings = await SemesterSubjectMapping.distinct('department');
        log(`Departments in SemesterSubjectMapping: ${JSON.stringify(mappings)}`);

        const faculty = await FacultyProfile.distinct('department');
        log(`Departments in FacultyProfile: ${JSON.stringify(faculty)}`);

        log('\nSample mapping 10 subjects:');
        const sampleSubs = await AcademicSubject.find().limit(10);
        sampleSubs.forEach(s => log(`- ${s.subjectCode}: ${s.subjectName} (${s.department})`));

        log('\nSample 5 sections:');
        const sampleSecs = await AcademicSection.find().limit(5);
        sampleSecs.forEach(s => log(`- ${s.name}: ${s.department}`));

        fs.writeFileSync('allocation_debug.txt', output);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();
