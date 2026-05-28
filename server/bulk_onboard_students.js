const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const User = require('./src/models/auth/User');
const AdmissionApplication = require('./src/models/admission-management/AdmissionApplication');
const StudentMaster = require('./src/models/student-master/StudentMaster');
const Notification = require('./src/models/Notification');

dotenv.config();

// Enums from client/src/modules/admission-management/pages/student/AdmissionFormPage.jsx
const CATEGORY_QUOTA_OPTIONS = ['Open', 'OBC', 'SC', 'ST', 'EWS', 'PwD', 'Minority'];
const ADMISSION_TYPE_OPTIONS = ['Regular', 'Management Quota', 'Lateral Entry'];

const students = [
  { ln: "Mungal", fn: "Lakhan", mn: "Subhashrao", gender: "Male" },
  { ln: "Kavhale", fn: "Abhay", mn: "Kailas", gender: "Male" },
  { ln: "Lavhore", fn: "Ganesh", mn: "Dhananjay", gender: "Male" },
  { ln: "Kuthare", fn: "Mangal", mn: "Gajanan", gender: "Female" },
  { ln: "Kolikar", fn: "Rijuta", mn: "Prakashrao", gender: "Female" },
  { ln: "Jajoo", fn: "Aanchal", mn: "Arvindkumar", gender: "Female" },
  { ln: "Jaldawar", fn: "Sunit", mn: "Satish", gender: "Male" },
  { ln: "Kadam", fn: "Prachi", mn: "Vikas", gender: "Female" },
  { ln: "Pawar", fn: "Gayatri", mn: "Dinesh", gender: "Female" },
  { ln: "Padamwar", fn: "Gayatri", mn: "Mahesh", gender: "Female" },
  { ln: "Tupkari", fn: "Aditya", mn: "Devanand", gender: "Male" },
  { ln: "Ghatol", fn: "Vedant", mn: "Chandrakant", gender: "Male" },
  { ln: "Pujari", fn: "Nirupama", mn: "Anil", gender: "Female" },
  { ln: "Kahalekar", fn: "Vaibhav", mn: "Anilrao", gender: "Male" },
  { ln: "Patil", fn: "Samiksha", mn: "Sunil", gender: "Female" },
  { ln: "Narwade", fn: "Abhishek", mn: "Bhagwat", gender: "Male" },
  { ln: "Shinde", fn: "Shubham", mn: "Sudhakar", gender: "Male" },
  { ln: "Pimparwar", fn: "Ritesh", mn: "Balaji", gender: "Male" },
  { ln: "Khating", fn: "Vaishnavi", mn: "Ramrao", gender: "Female" },
  { ln: "Nandedkar", fn: "Ruturaj", mn: "Dinesh", gender: "Male" },
  { ln: "Jadhav", fn: "Komal", mn: "Balasaheb", gender: "Female" },
  { ln: "Gundawar", fn: "Radhika", mn: "Govind", gender: "Female" },
  { ln: "Varni", fn: "Saikrishna", mn: "Srinivas", gender: "Male" },
  { ln: "Pachpande", fn: "Shriyash", mn: "Rajendra", gender: "Male" },
  { ln: "Quazi", fn: "Azeem", mn: "Siddiqui", gender: "Male" },
  { ln: "Chawalwala", fn: "Abdus", mn: "Sami", gender: "Male" },
  { ln: "Pathak", fn: "Chinmay", mn: "Vinayak", gender: "Male" },
  { ln: "Patawar", fn: "Shruti", mn: "Ramesh", gender: "Female" },
  { ln: "Mahatme", fn: "Ganesh", mn: "Dnyaneshwar", gender: "Male" },
  { ln: "Padampalle", fn: "Nivratti", mn: "Sambhaji", gender: "Male" },
  { ln: "Dhage", fn: "Eknath", mn: "Raghoji", gender: "Male" },
  { ln: "Kamajwar", fn: "Aditya", mn: "Shrikant", gender: "Male" },
  { ln: "Lone", fn: "Niranjana", mn: "Bapurao", gender: "Female" },

  // Image 2
  { ln: "Katkade", fn: "Vaibhavi", mn: "Tukaram", gender: "Female" },
  { ln: "Inamul Haq Osmani", fn: "Abdul Mogni", mn: "", gender: "Male" },
  { ln: "Bhojne", fn: "Pranav", mn: "Ashok", gender: "Male" },
  { ln: "Deshpande", fn: "Madhav", mn: "Sandeep", gender: "Male" },
  { ln: "Bodke", fn: "Pallavi", mn: "Nilkanth", gender: "Female" },
  { ln: "Chavan", fn: "Riturani", mn: "Arjun", gender: "Female" },
  { ln: "Bhawthankar", fn: "Kedar", mn: "Sunil", gender: "Male" },
  { ln: "Kulkarni", fn: "Adwait", mn: "Dhananjay", gender: "Male" },
  { ln: "Vyawahare", fn: "Sanika", mn: "Mahesh", gender: "Female" },
  { ln: "Thool", fn: "Sujal", mn: "Dipak", gender: "Male" },
  { ln: "Noman Khan", fn: "Ayyub", mn: "Khan", gender: "Male" },
  { ln: "Gore", fn: "Adinath", mn: "Hanumant", gender: "Male" },
  { ln: "Rayyan Juraid", fn: "Rayyan Juraid", mn: "Rafiullah Khan", gender: "Male" },
  { ln: "Wankhede", fn: "Priya", mn: "Balaji", gender: "Female" },
  { ln: "Patange", fn: "Achal", mn: "Sandeeprao", gender: "Female" },
  { ln: "Lohabande", fn: "Mansi", mn: "Bhimrao", gender: "Female" },
  { ln: "Parekar", fn: "Mayuri", mn: "Devrao", gender: "Female" },
  { ln: "Murshetwar", fn: "Shivani", mn: "Balaji", gender: "Female" },
  { ln: "Hulgulwad", fn: "Saloni", mn: "Rajeshwar", gender: "Female" },
  { ln: "Wakade", fn: "Sneha", mn: "Dinkar", gender: "Female" },
  { ln: "Mundada", fn: "Janhavi", mn: "Mahesh", gender: "Female" },
  { ln: "Purvi", fn: "Shweta", mn: "Nagraj", gender: "Female" },
  { ln: "Anantwar", fn: "Pratiksha", mn: "Chennappa", gender: "Female" },
  { ln: "Maslekar", fn: "Shruti", mn: "Dilip", gender: "Female" },
  { ln: "Lone", fn: "Pritam", mn: "Ramesh", gender: "Male" },
  { ln: "Pathan", fn: "Ayesha", mn: "Rasul", gender: "Female" },
  { ln: "Kandkurte", fn: "Gayatri", mn: "Venkatesh", gender: "Female" },
  { ln: "Lone", fn: "Samiksha", mn: "Balaji", gender: "Female" },
  { ln: "Godbole", fn: "Harshdip", mn: "Munjaji", gender: "Male" },
  { ln: "Ghongade", fn: "Prathmesh", mn: "Vasant", gender: "Male" },
  { ln: "Kamble", fn: "Sunil", mn: "Venkatrao", gender: "Male" },
  { ln: "Hatkar", fn: "Sneha", mn: "Madhavrao", gender: "Female" }
];

const sanitizeNamePart = (str = '') =>
  str.toLowerCase().replace(/[^a-z0-9]/g, '');

const generateRandomPhone = () => {
  const prefix = ['9', '8', '7'][Math.floor(Math.random() * 3)];
  let remaining = '';
  for (let i = 0; i < 9; i++) {
    remaining += Math.floor(Math.random() * 10);
  }
  return prefix + remaining;
};

const generateRandomAadhaar = () => {
  let aadhaar = '';
  for (let i = 0; i < 12; i++) {
    aadhaar += Math.floor(Math.random() * 10);
  }
  return aadhaar;
};

const bulkOnboard = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Find the staff user to associate as the creator and reviewer
    const staffUser = await User.findOne({ email: 'staff@erpsaa.com' });
    if (!staffUser) {
      console.error('Error: staff@erpsaa.com user not found in the database. Make sure you run the seeders or create the user first.');
      process.exit(1);
    }
    console.log(`Found Staff User: ${staffUser.fullName} (${staffUser._id})`);

    const yearStr = '2022';
    let addedCount = 0;

    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      const firstName = s.fn;
      const lastName = s.ln;
      const middlename = s.mn;
      const gender = s.gender;

      const baseLocal = `${sanitizeNamePart(firstName)}${sanitizeNamePart(lastName)}${yearStr}`;
      
      // Email generation loop to match the controller logic
      let generatedEmail = `${baseLocal}@erpsaa.com`;
      let attempt = 0;
      while (await User.findOne({ email: generatedEmail })) {
        attempt++;
        generatedEmail = `${baseLocal}${attempt}@erpsaa.com`;
      }

      console.log(`Processing student: ${firstName} ${lastName} (${generatedEmail})`);

      // 1. Create User
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const newUser = new User({
        fullName,
        email: generatedEmail,
        password: '123456', // Hashed automatically by Pre-Save Middleware in UserSchema
        role: 'student',
        isActive: true,
        mustChangePassword: true,
        createdBy: staffUser._id
      });
      await newUser.save();

      // 2. Create Admission Application (Mimics the 6-step form submission)
      const newAppId = `APP-${Date.now() + i}-${Math.floor(Math.random() * 1000)}`;
      const mobileNumber = generateRandomPhone();
      
      const quota = CATEGORY_QUOTA_OPTIONS[i % CATEGORY_QUOTA_OPTIONS.length];
      const admissionType = ADMISSION_TYPE_OPTIONS[i % ADMISSION_TYPE_OPTIONS.length];
      const meritScholarship = (i % 3 === 0); // Merit Scholarship checked for every 3rd student

      const newAdmission = new AdmissionApplication({
        applicationId: newAppId,
        linkedUserId: newUser._id,
        applicationStatus: 'approved',
        admissionYear: 2022,
        personalDetails: {
          fullName,
          fatherName: middlename || 'FatherName',
          motherName: 'MotherName',
          gender,
          dateOfBirth: new Date(2004, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          bloodGroup: 'O+',
          nationality: 'Indian',
          category: 'General',
          religion: 'Hindu',
          mobileNumber,
          alternateMobile: '',
          email: generatedEmail,
          aadhaarId: generateRandomAadhaar(),
          profilePhotoUrl: ''
        },
        addressDetails: {
          current: {
            addressLine1: 'MGM Boys/Girls Hostel',
            addressLine2: '',
            city: 'Nanded',
            district: 'Nanded',
            state: 'Maharashtra',
            pincode: '431605'
          },
          permanentSameAsCurrent: true,
          permanent: {
            addressLine1: 'MGM Boys/Girls Hostel',
            addressLine2: '',
            city: 'Nanded',
            district: 'Nanded',
            state: 'Maharashtra',
            pincode: '431605'
          }
        },
        academicDetails: {
          tenthBoard: 'State Board',
          tenthSchool: 'MGM Secondary School',
          tenthPassingYear: '2020',
          tenthScore: '85',
          twelfthBoard: 'State Board',
          twelfthCollege: 'MGM Junior College',
          twelfthPassingYear: '2022',
          twelfthScore: '80',
          entranceExamName: 'MHT-CET',
          entranceScore: '90',
          rank: String(10000 + Math.floor(Math.random() * 20000)),
          previousCollege: '',
          transferCertificateNumber: ''
        },
        courseSelection: {
          programType: 'Undergraduate',
          department: 'Information Technology',
          course: 'B.Tech',
          specialization: 'IT',
          admissionType,
          categoryQuota: quota,
          preferredHostel: false,
          scholarshipApplied: meritScholarship
        },
        guardianDetails: {
          guardianName: `${middlename || 'FatherName'} ${lastName}`,
          guardianRelation: 'Father',
          guardianPhone: generateRandomPhone(),
          guardianOccupation: 'Business',
          emergencyContactName: `${middlename || 'FatherName'} ${lastName}`,
          emergencyContactPhone: generateRandomPhone(),
          emergencyContactRelation: 'Father'
        },
        uploadedDocuments: {
          tenthMarksheet: null,
          twelfthMarksheet: null,
          transferCertificate: null,
          migrationCertificate: null,
          casteCertificate: null,
          incomeCertificate: null,
          passportPhoto: null,
          idProof: null,
          domicileCertificate: null,
          entranceScorecard: null,
          disabilityCertificate: null
        },
        submittedAt: Date.now(),
        approvedAt: Date.now(),
        reviewedBy: staffUser._id
      });
      await newAdmission.save();

      // 3. Create Student Master (Mimics the Admission Approval hook)
      const randomPart = Math.floor(1000 + Math.random() * 9000); 
      const newStudentId = `STU-2022-${randomPart}`;

      const newStudent = new StudentMaster({
        userId: newUser._id,
        admissionId: newAdmission._id,
        studentId: newStudentId,
        enrollmentStatus: 'active',
        academicProfile: {
          department: 'Information Technology',
          course: 'B.Tech',
          specialization: 'IT',
          batch: '2022-2026',
          currentSemester: 1,
          enrollmentDate: Date.now()
        },
        personalDetails: {
          fullName,
          dateOfBirth: newAdmission.personalDetails.dateOfBirth,
          gender,
          bloodGroup: newAdmission.personalDetails.bloodGroup,
          profilePhotoUrl: ''
        },
        contactDetails: {
          email: generatedEmail,
          mobileNumber,
          emergencyContact: newAdmission.guardianDetails.emergencyContactPhone
        },
        uploadedDocuments: newAdmission.uploadedDocuments || {},
        history: [{
          action: 'AUTOMATIC_ONBOARDING',
          changedBy: staffUser._id,
          details: { note: 'Record created via Admission Approval integration' }
        }]
      });
      await newStudent.save();

      // 4. Create Notification to mimic system activity
      await Notification.create({
        recipient: newUser._id,
        actor: staffUser._id,
        type: 'application_approved',
        title: 'Admission Approved!',
        message: `Congratulations! Your admission to B.Tech IT has been approved. Your Student ID is ${newStudentId}.`,
        relatedApplication: newAdmission._id
      });

      // 5. Append student credentials to passwords.md
      const passwordEntry = `\n${generatedEmail}\n[123456]\n`;
      fs.appendFileSync('./passwords.md', passwordEntry);

      console.log(`[ONBOARDED] ${fullName} -> ${generatedEmail} | ${newStudentId}`);
      addedCount++;
    }

    console.log(`\nSuccessfully onboarded ${addedCount} students and saved credentials to passwords.md!`);
    process.exit(0);
  } catch (error) {
    console.error('Error during bulk onboarding:', error);
    process.exit(1);
  }
};

bulkOnboard();
