const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const AdmissionApplication = require('./src/models/admission-management/AdmissionApplication');
const StudentMaster = require('./src/models/student-master/StudentMaster');

dotenv.config();

const BYIT_DIR = path.join(__dirname, '../client/public/collegeprofile/students/BYIT');
const UPLOADS_PROFILE_DIR = path.join(__dirname, 'uploads/profile-photos');
const UPLOADS_DOCS_DIR = path.join(__dirname, 'uploads/admission-documents');

// Ensure upload dirs exist
if (!fs.existsSync(UPLOADS_PROFILE_DIR)) fs.mkdirSync(UPLOADS_PROFILE_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DOCS_DIR)) fs.mkdirSync(UPLOADS_DOCS_DIR, { recursive: true });

const sanitizeNamePart = (str = '') =>
  str.toLowerCase().replace(/[^a-z0-9]/g, '');

const updatePhotos = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB!');

    // Read all files in BYIT
    const files = fs.readdirSync(BYIT_DIR).filter(f => f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));
    console.log(`Found ${files.length} photos in BYIT.`);

    // Find all applications of B.Tech IT, admission year 2022
    const apps = await AdmissionApplication.find({
      admissionYear: 2022,
      "courseSelection.department": "Information Technology"
    });

    console.log(`Found ${apps.length} applications in database to check.`);

    let matchedCount = 0;
    let placeholderCount = 0;

    for (let app of apps) {
      // Find full name parts
      const nameParts = app.personalDetails.fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts[1] || '';

      const fnNorm = sanitizeNamePart(firstName);
      const lnNorm = sanitizeNamePart(lastName);
      const fullNorm = fnNorm + lnNorm;

      // Try to find matching file
      let matchedFile = null;
      
      // First try to match full name
      matchedFile = files.find(f => {
        const base = sanitizeNamePart(path.basename(f, path.extname(f)));
        return base === fullNorm;
      });

      // If not matched, try matching only first name
      if (!matchedFile) {
        matchedFile = files.find(f => {
          const base = sanitizeNamePart(path.basename(f, path.extname(f)));
          return base === fnNorm;
        });
      }

      let profilePhotoUrl = '';
      let passportPhotoObj = null;

      if (matchedFile) {
        const sourcePath = path.join(BYIT_DIR, matchedFile);
        const timestamp = Date.now();
        const rand = Math.floor(Math.random() * 1000000);
        const ext = path.extname(matchedFile);
        
        const profileStoredName = `profilePhoto-${timestamp}-${rand}${ext}`;
        const profileDestPath = path.join(UPLOADS_PROFILE_DIR, profileStoredName);
        fs.copyFileSync(sourcePath, profileDestPath);
        profilePhotoUrl = `/uploads/profile-photos/${profileStoredName}`;

        const docStoredName = `passportPhoto-${timestamp}-${rand}${ext}`;
        const docDestPath = path.join(UPLOADS_DOCS_DIR, docStoredName);
        fs.copyFileSync(sourcePath, docDestPath);
        passportPhotoObj = {
          originalName: matchedFile,
          storedName: docStoredName,
          filePath: `/uploads/admission-documents/${docStoredName}`,
          mimeType: ext.toLowerCase() === '.png' ? 'image/png' : 'image/jpeg',
          uploadedAt: new Date()
        };

        console.log(`[MATCHED] ${app.personalDetails.fullName} -> ${matchedFile}`);
        matchedCount++;
      } else {
        // Clear photo fields for unmatched candidates
        profilePhotoUrl = "";
        passportPhotoObj = null;
        
        console.log(`[CLEARED] ${app.personalDetails.fullName} -> keeping empty avatar`);
        placeholderCount++;
      }

      // Update AdmissionApplication
      app.personalDetails.profilePhotoUrl = profilePhotoUrl;
      app.uploadedDocuments = app.uploadedDocuments || {};
      app.uploadedDocuments.passportPhoto = passportPhotoObj;
      await app.save();

      // Update StudentMaster
      const student = await StudentMaster.findOne({ admissionId: app._id });
      if (student) {
        student.personalDetails.profilePhotoUrl = profilePhotoUrl;
        student.uploadedDocuments = student.uploadedDocuments || {};
        student.uploadedDocuments.passportPhoto = passportPhotoObj;
        await student.save();
      }
    }

    console.log(`\nFinished! Matched: ${matchedCount}, Placeholders: ${placeholderCount}`);
    process.exit(0);
  } catch (err) {
    console.error('Error in photo update:', err);
    process.exit(1);
  }
};

updatePhotos();
