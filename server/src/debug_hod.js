const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/auth/User');
const FacultyProfile = require('../models/academic/FacultyProfile');
const AcademicSubject = require('../models/academic/AcademicSubject');

dotenv.config({ path: '../../.env' });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB\n');

        const subjects = await AcademicSubject.find({}).limit(5);
        console.log('--- Subjects (sample) ---');
        subjects.forEach(s => console.log(`Name: ${s.subjectName}, Code: ${s.subjectCode}, Dept: ${s.department}`));

        const hodUser = await User.findOne({ role: 'hod' });
        if (hodUser) {
            console.log('\n--- HOD User ---');
            console.log(`ID: ${hodUser._id}, Email: ${hodUser.email}, Role: ${hodUser.role}`);
            
            const profile = await FacultyProfile.findOne({ user: hodUser._id });
            if (profile) {
                console.log('--- HOD Profile ---');
                console.log(`Dept: ${profile.department}, Designation: ${profile.designation}`);
            } else {
                console.log('HOD Profile NOT FOUND');
            }
        } else {
            console.log('No HOD User found in DB');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
