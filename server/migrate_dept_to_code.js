const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const AcademicSection = require('./src/models/academic/AcademicSection');
const StudentMaster = require('./src/models/student-master/StudentMaster');
const Department = require('./src/models/academic/Department');
const SemesterSubjectMapping = require('./src/models/academic/SemesterSubjectMapping');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const departments = await Department.find({});
    const deptMap = {}; // name -> code
    const deptCodes = new Set();
    
    departments.forEach(d => {
      deptMap[d.name] = d.code;
      deptCodes.add(d.code);
    });

    console.log('Department Map:', deptMap);

    // 1. Migrate AcademicSections
    const sections = await AcademicSection.find({});
    console.log(`Checking ${sections.length} sections...`);
    for (const section of sections) {
      if (deptMap[section.department]) {
        console.log(`Updating Section "${section.name}": "${section.department}" -> "${deptMap[section.department]}"`);
        section.department = deptMap[section.department];
        await section.save();
      } else if (!deptCodes.has(section.department)) {
        console.log(`Warning: Section "${section.name}" has unknown department "${section.department}"`);
      }
    }

    // 2. Migrate StudentMasters
    const students = await StudentMaster.find({});
    console.log(`Checking ${students.length} students...`);
    for (const student of students) {
      const dept = student.academicProfile?.department;
      if (dept && deptMap[dept]) {
        console.log(`Updating Student "${student.personalDetails?.fullName}": "${dept}" -> "${deptMap[dept]}"`);
        student.academicProfile.department = deptMap[dept];
        await student.save();
      } else if (dept && !deptCodes.has(dept)) {
        console.log(`Warning: Student "${student.personalDetails?.fullName}" has unknown department "${dept}"`);
      }
    }

    // 3. Migrate SemesterSubjectMappings (just in case some are names)
    const mappings = await SemesterSubjectMapping.find({});
    console.log(`Checking ${mappings.length} mappings...`);
    for (const mapping of mappings) {
      if (deptMap[mapping.department]) {
        console.log(`Updating Mapping: "${mapping.department}" -> "${deptMap[mapping.department]}"`);
        mapping.department = deptMap[mapping.department];
        await mapping.save();
      }
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
