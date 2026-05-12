const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const User = require('./src/models/auth/User');
const FeeStructure = require('./src/models/fees-management/FeeStructure');
const StudentMaster = require('./src/models/student-master/StudentMaster');
const StudentFeeAccount = require('./src/models/fees-management/StudentFeeAccount');

dotenv.config();

const seedFees = async () => {
  try {
    await connectDB();

    // 1. Create Staff Account
    const existingStaff = await User.findOne({ email: 'accounts@erpsaa.com' });
    if (!existingStaff) {
      await User.create({
        fullName: 'Accounts Department',
        email: 'accounts@erpsaa.com',
        username: 'accounts_erpsaa',
        password: '123456', 
        role: 'staff_account',
        isActive: true,
        mustChangePassword: false
      });
      console.log('✅ Accounts Staff created: accounts@erpsaa.com');
    }

    // 2. Create Diverse Fee Structures
    const structuresData = [
        { course: 'B.Tech', yearNumber: 1, academicYear: '2026-2027', totalAmount: 120000, components: [{name: 'Tuition', amount: 80000}, {name: 'Lab', amount: 40000}] },
        { course: 'MBA', yearNumber: 1, academicYear: '2026-2027', totalAmount: 150000, components: [{name: 'Tuition', amount: 100000}, {name: 'Library', amount: 50000}] },
        { course: 'BCA', yearNumber: 1, academicYear: '2026-2027', totalAmount: 90000, components: [{name: 'Tuition', amount: 60000}, {name: 'Exam', amount: 30000}] }
    ];

    const structures = [];
    for (const s of structuresData) {
        let entry = await FeeStructure.findOne({ course: s.course, yearNumber: s.yearNumber, academicYear: s.academicYear });
        if (!entry) {
            entry = await FeeStructure.create(s);
            console.log(`✅ Fee Structure created: ${s.course}`);
        }
        structures.push(entry);
    }

    // 3. Create Fee Accounts for all students in Master
    const students = await StudentMaster.find();
    console.log(`Found ${students.length} students in Master.`);

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const existingAccount = await StudentFeeAccount.findOne({ studentId: student._id });
        
        if (!existingAccount) {
            const structure = structures[i % structures.length];
            const status = i % 3 === 0 ? 'paid' : (i % 3 === 1 ? 'partial' : 'unpaid');
            const totalPaid = status === 'paid' ? structure.totalAmount : (status === 'partial' ? structure.totalAmount / 2 : 0);

            await StudentFeeAccount.create({
                studentId: student._id,
                feeStructureId: structure._id,
                academicYear: structure.academicYear,
                currentYear: structure.yearNumber,
                totalPayable: structure.totalAmount,
                totalPaid: totalPaid,
                balance: structure.totalAmount - totalPaid,
                status: status,
                installments: [
                    { dueDate: new Date(), amount: structure.totalAmount / 2, status: totalPaid >= structure.totalAmount / 2 ? 'paid' : 'pending' },
                    { dueDate: new Date(Date.now() + 90*24*60*60*1000), amount: structure.totalAmount / 2, status: totalPaid === structure.totalAmount ? 'paid' : 'pending' }
                ]
            });
            console.log(`✅ Fee Account created for ${student.personalDetails.fullName} (${status})`);
        }
    }

    console.log('🎯 Seeding complete!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedFees();
