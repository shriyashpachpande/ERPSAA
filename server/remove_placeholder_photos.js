const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AdmissionApplication = require('./src/models/admission-management/AdmissionApplication');
const StudentMaster = require('./src/models/student-master/StudentMaster');

dotenv.config();

const cleanPlaceholders = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB!');

    const placeholderPath = "/uploads/profile-photos/profilePhoto-1776128151752-345914.jpeg";

    // 1. Clean AdmissionApplication
    const appsResult = await AdmissionApplication.updateMany(
      { "personalDetails.profilePhotoUrl": placeholderPath },
      { 
        $set: { 
          "personalDetails.profilePhotoUrl": "",
          "uploadedDocuments.passportPhoto": null
        } 
      }
    );
    console.log(`Cleaned ${appsResult.modifiedCount} AdmissionApplication records.`);

    // 2. Clean StudentMaster
    const studentsResult = await StudentMaster.updateMany(
      { "personalDetails.profilePhotoUrl": placeholderPath },
      { 
        $set: { 
          "personalDetails.profilePhotoUrl": "",
          "uploadedDocuments.passportPhoto": null
        } 
      }
    );
    console.log(`Cleaned ${studentsResult.modifiedCount} StudentMaster records.`);

    console.log('\nAll default placeholder photos removed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning placeholders:', err);
    process.exit(1);
  }
};

cleanPlaceholders();
