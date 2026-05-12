const mongoose = require('mongoose');
const StudentFeeAccount = require('../../models/fees-management/StudentFeeAccount');
const FeePaymentEntry = require('../../models/fees-management/FeePaymentEntry');
const DigitalReceipt = require('../../models/fees-management/DigitalReceipt');
const FeeStructure = require('../../models/fees-management/FeeStructure');
const StudentMaster = require('../../models/student-master/StudentMaster');

// @desc    Get logged-in student's fee summary
// @route   GET /api/fees/my-fees
// @access  Private (Student)
exports.getMyFees = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(200).json({ success: true, initialized: false, message: 'Student profile not found' });
    }

    const feeAccount = await StudentFeeAccount.findOne({ studentId: student._id })
      .populate('feeStructureId')
      .lean();

    if (!feeAccount) {
      return res.status(200).json({ success: true, initialized: false, message: 'Fee account not initialized' });
    }

    const payments = await FeePaymentEntry.find({ feeAccountId: feeAccount._id })
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      initialized: true,
      data: {
        account: feeAccount,
        payments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all receipts for logged-in student
// @route   GET /api/fees/my-receipts
// @access  Private (Student)
exports.getMyReceipts = async (req, res) => {
  try {
    const student = await StudentMaster.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(200).json({ success: true, data: [] });
    }
    const receipts = await DigitalReceipt.find({ studentId: student._id })
      .populate('paymentEntryId')
      .sort({ generatedAt: -1 });

    res.status(200).json({ success: true, data: receipts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get Fee Management Dashboard (Stats)
// @route   GET /api/fees/staff/dashboard
// @access  Private (Staff/Admin)
exports.getFeeDashboard = async (req, res) => {
  try {
    const stats = await StudentFeeAccount.aggregate([
      {
        $group: {
          _id: null,
          totalExpected: { $sum: '$totalPayable' },
          totalCollected: { $sum: '$totalPaid' },
          totalOutstanding: { $sum: '$balance' },
          count: { $sum: 1 }
        }
      }
    ]);

    const recentPayments = await FeePaymentEntry.find()
      .populate({
        path: 'feeAccountId',
        populate: { path: 'studentId', select: 'personalDetails.fullName studentId' }
      })
      .sort({ paymentDate: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || { totalExpected: 0, totalCollected: 0, totalOutstanding: 0, count: 0 },
        recentPayments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Search students for fee management (Lists all students with optional account status)
// @route   GET /api/fees/staff/students
// @access  Private (Staff/Admin)
exports.searchStudentFees = async (req, res) => {
  try {
    const { search, department, status, course } = req.query;

    let matchQuery = {};
    if (department) matchQuery['academicProfile.department'] = department;
    if (course) matchQuery['academicProfile.course'] = course;
    if (search) {
      matchQuery['$or'] = [
        { 'personalDetails.fullName': { $regex: search, $options: 'i' } },
        { 'studentId': { $regex: search, $options: 'i' } }
      ];
    }

    // Use aggregation to join StudentMaster with StudentFeeAccount
    const students = await StudentMaster.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'studentfeeaccounts',
          localField: '_id',
          foreignField: 'studentId',
          as: 'feeAccount'
        }
      },
      {
        // We typically want the latest/current account
        $addFields: {
          feeAccount: { $arrayElemAt: ["$feeAccount", 0] }
        }
      },
      {
        $match: status ? { 'feeAccount.status': status } : {}
      },
      { $sort: { 'personalDetails.fullName': 1 } }
    ]);

    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get student fee details
// @route   GET /api/fees/staff/students/:id
// @access  Private (Staff/Admin)
exports.getStudentFeeDetail = async (req, res) => {
  try {
    const account = await StudentFeeAccount.findById(req.params.id)
      .populate('studentId')
      .populate('feeStructureId');

    if (!account) return res.status(404).json({ success: false, error: 'Account not found' });

    const payments = await FeePaymentEntry.find({ feeAccountId: account._id }).sort({ paymentDate: -1 });
    const receipts = await DigitalReceipt.find({ studentId: account.studentId._id }).sort({ generatedAt: -1 });

    res.status(200).json({
      success: true,
      data: { account, payments, receipts }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add payment entry
// @route   POST /api/fees/staff/payments
// @access  Private (Staff/Admin)
exports.addPayment = async (req, res) => {
  try {
    const { feeAccountId, amount, paymentMode, transactionId, remarks } = req.body;

    const account = await StudentFeeAccount.findById(feeAccountId);
    if (!account) return res.status(404).json({ success: false, error: 'Fee account not found' });

    const payment = await FeePaymentEntry.create({
      feeAccountId,
      amount,
      paymentMode,
      transactionId,
      remarks,
      receivedBy: req.user._id
    });

    // Update account balance
    account.totalPaid += Number(amount);

    // Auto-reconcile installments
    let runningPaid = account.totalPaid;
    account.installments.forEach(inst => {
      if (runningPaid >= inst.amount) {
        inst.status = 'paid';
        runningPaid -= inst.amount;
      } else {
        inst.status = 'pending';
      }
    });

    await account.save();

    // Generate Receipt Record
    const receiptCount = await DigitalReceipt.countDocuments();
    const receiptNumber = `RCPT-${new Date().getFullYear()}-${(receiptCount + 1).toString().padStart(5, '0')}`;

    await DigitalReceipt.create({
      receiptNumber,
      paymentEntryId: payment._id,
      studentId: account.studentId
    });

    res.status(201).json({ success: true, data: payment, receiptNumber });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single receipt detail
// @route   GET /api/fees/my-receipts/:receiptId
// @access  Private (Student/Staff)
exports.getReceiptDetail = async (req, res) => {
  try {
    const receipt = await DigitalReceipt.findById(req.params.receiptId)
      .populate({
        path: 'paymentEntryId',
        populate: { path: 'receivedBy', select: 'fullName' }
      })
      .populate({
        path: 'studentId',
        select: 'personalDetails studentId academicProfile'
      });

    if (!receipt) return res.status(404).json({ success: false, error: 'Receipt not found' });

    // Security: Student can only see their own receipt
    if (req.user.role === 'student' && receipt.studentId._id.toString() !== (await StudentMaster.findOne({ userId: req.user._id }))._id.toString()) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all fee structures
// @route   GET /api/fees/staff/fee-structures
// @access  Private (Staff/Admin)
exports.getFeeStructures = async (req, res) => {
  try {
    const { course, yearNumber } = req.query;
    const query = { isActive: true };
    if (course) query.course = course;
    if (yearNumber) query.yearNumber = yearNumber;

    const structures = await FeeStructure.find(query).sort({ course: 1, yearNumber: 1 });
    res.status(200).json({ success: true, data: structures });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update fee structure
// @route   PUT /api/fees/staff/fee-structures/:id
// @access  Private (Admin)
exports.updateFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!structure) return res.status(404).json({ success: false, error: 'Structure not found' });
    res.status(200).json({ success: true, data: structure });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete fee structure (Soft Delete)
// @route   DELETE /api/fees/staff/fee-structures/:id
// @access  Private (Admin)
exports.deleteFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!structure) return res.status(404).json({ success: false, error: 'Structure not found' });
    res.status(200).json({ success: true, message: 'Structure deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Initialize fee account for student
// @route   POST /api/fees/staff/students/:studentMasterId/init-account
// @access  Private (Staff/Admin)
// exports.initStudentFeeAccount = async (req, res) => {
//     try {
//         const { feeStructureId } = req.body;
//         const student = await StudentMaster.findById(req.params.studentMasterId);
//         if (!student) return res.status(404).json({ success: false, error: 'Student not found' });

//         const structure = await FeeStructure.findById(feeStructureId);
//         if (!structure) return res.status(404).json({ success: false, error: 'Fee structure not found' });

//         // Check if student already has an account for THIS specific year
//         const existingAccount = await StudentFeeAccount.findOne({ 
//             studentId: student._id,
//             currentYear: structure.yearNumber,
//             academicYear: structure.academicYear
//         });

//         if (existingAccount) return res.status(400).json({ success: false, error: `Fee account already exists for Year ${structure.yearNumber}` });

//         console.log('Creating account with:', {
//             studentId: student._id,
//             feeStructureId,
//             totalAmount: structure.totalAmount,
//             academicYear: structure.academicYear,
//             yearNumber: structure.yearNumber
//         });

//         const account = await StudentFeeAccount.create({
//             studentId: student._id,
//             feeStructureId,
//             academicYear: structure.academicYear,
//             currentYear: structure.yearNumber,
//             totalPayable: structure.totalAmount,
//             totalPaid: 0,
//             balance: structure.totalAmount,
//             status: 'unpaid',
//             installments: [
//                 { dueDate: new Date(), amount: Math.round(structure.totalAmount * 0.5), status: 'pending' },
//                 { dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), amount: Math.round(structure.totalAmount * 0.5), status: 'pending' }
//             ]
//         });

//         res.status(201).json({ success: true, data: account });
//     } catch (error) {
//         console.error('Error in initStudentFeeAccount:', error);
//         res.status(500).json({ 
//             success: false, 
//             error: error.message || error,
//             stack: error.stack 
//         });
//     }
// };


exports.initStudentFeeAccount = async (req, res) => {
  try {
    const { feeStructureId } = req.body;
    const { studentMasterId } = req.params;

    if (!studentMasterId || !feeStructureId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID and Fee Structure ID are required'
      });
    }

    const student = await StudentMaster.findById(studentMasterId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Target student record not found in Master'
      });
    }

    const structure = await FeeStructure.findById(feeStructureId);
    if (!structure) {
      return res.status(404).json({
        success: false,
        error: 'Selected fee structure no longer exists'
      });
    }

    const existingAccount = await StudentFeeAccount.findOne({
      studentId: student._id,
      currentYear: structure.yearNumber,
      academicYear: structure.academicYear
    });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        error: `A fee account already exists for Year ${structure.yearNumber} (${structure.academicYear})`
      });
    }

    const firstInstallment = Math.round(structure.totalAmount * 0.5);
    const secondInstallment = structure.totalAmount - firstInstallment;

    const account = await StudentFeeAccount.create({
      studentId: student._id,
      feeStructureId,
      academicYear: structure.academicYear,
      currentYear: structure.yearNumber,
      totalPayable: structure.totalAmount,
      totalPaid: 0,
      balance: structure.totalAmount,
      status: 'unpaid',
      installments: [
        {
          dueDate: new Date(),
          amount: firstInstallment,
          status: 'pending'
        },
        {
          dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          amount: secondInstallment,
          status: 'pending'
        }
      ]
    });

    student.modules = student.modules || {};
    student.modules.fees = {
      status: 'unpaid',
      lastUpdated: new Date(),
      notes: `Account initialized with structure Year ${structure.yearNumber}`
    };
    student.markModified('modules');
    await student.save();

    return res.status(201).json({
      success: true,
      message: 'Fee account initialized successfully',
      data: account
    });

  } catch (error) {
    console.error('Error in initStudentFeeAccount:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
};

// @desc    Get Enhanced Fee Management Dashboard (Full Stats & Charts)
// @route   GET /api/fees/staff/dashboard/enhanced
// @access  Private (Staff/Admin)
exports.getEnhancedFeeDashboard = async (req, res) => {
  try {
    // 1. Primary KPIs
    const primaryStats = await StudentFeeAccount.aggregate([
      {
        $group: {
          _id: null,
          totalExpected: { $sum: '$totalPayable' },
          totalCollected: { $sum: '$totalPaid' },
          totalOutstanding: { $sum: '$balance' },
          activeAccounts: { $sum: 1 }
        }
      }
    ]);

    // 2. Secondary/Operational Status
    const statusStats = await StudentFeeAccount.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusMap = { paid: 0, partial: 0, unpaid: 0 };
    statusStats.forEach(s => { statusMap[s._id] = s.count; });

    // 3. Pending Fee Initialization (Students in Master without Fee Account)
    const totalStudents = await StudentMaster.countDocuments();
    const studentsWithAccount = await StudentFeeAccount.countDocuments();
    const pendingInitCount = Math.max(0, totalStudents - studentsWithAccount);

    // 4. Collection Trend (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const collectionTrend = await FeePaymentEntry.aggregate([
      { $match: { paymentDate: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          label: "$_id",
          count: "$total"
        }
      }
    ]);

    // 5. Course-wise Collection
    const courseWiseData = await StudentFeeAccount.aggregate([
      {
        $lookup: {
          from: 'studentmasters',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: '$student.academicProfile.course',
          totalCollected: { $sum: '$totalPaid' }
        }
      },
      { $sort: { totalCollected: -1 } },
      {
        $project: {
          course: "$_id",
          amount: "$totalCollected"
        }
      }
    ]);

    // 6. Recent Payments (10)
    const recentPayments = await FeePaymentEntry.find()
      .populate({
        path: 'feeAccountId',
        populate: { path: 'studentId', select: 'personalDetails.fullName studentId academicProfile.course' }
      })
      .sort({ paymentDate: -1 })
      .limit(10)
      .lean();

    // 7. Students Requiring Attention (Unpaid/Partial/Pending)
    const studentsAttention = await StudentFeeAccount.find({
      status: { $in: ['unpaid', 'partial'] }
    })
      .populate('studentId', 'personalDetails.fullName studentId academicProfile.course academicProfile.yearNumber')
      .sort({ balance: -1 })
      .limit(10)
      .lean();

    // 8. Fee Structure Snapshot
    const structureSnapshot = await StudentFeeAccount.aggregate([
      {
        $group: {
          _id: '$feeStructureId',
          assignedStudents: { $sum: 1 },
          expectedRevenue: { $sum: '$totalPayable' },
          collectedRevenue: { $sum: '$totalPaid' },
          pendingRevenue: { $sum: '$balance' }
        }
      },
      {
        $lookup: {
          from: 'feestructures',
          localField: '_id',
          foreignField: '_id',
          as: 'structure'
        }
      },
      { $unwind: '$structure' },
      {
        $project: {
          name: { $concat: ["$structure.course", " Year ", { $toString: "$structure.yearNumber" }] },
          assignedStudents: 1,
          expectedRevenue: 1,
          collectedRevenue: 1,
          pendingRevenue: 1
        }
      },
      { $limit: 4 }
    ]);

    // 9. Payment Mode Insight
    const modeInsight = await FeePaymentEntry.aggregate([
      {
        $group: {
          _id: '$paymentMode',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
          total: "$total"
        }
      }
    ]);

    // 10. Recent Receipts
    const recentReceipts = await DigitalReceipt.find()
      .populate('studentId', 'personalDetails.fullName')
      .sort({ generatedAt: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          primary: primaryStats[0] || { totalExpected: 0, totalCollected: 0, totalOutstanding: 0, activeAccounts: 0 },
          secondary: {
            ...statusMap,
            pendingInitialization: pendingInitCount
          }
        },
        collectionTrend,
        courseWiseData,
        recentPayments,
        studentsAttention,
        structureSnapshot,
        modeInsight,
        recentReceipts
      }
    });

  } catch (error) {
    console.error('Error in getEnhancedFeeDashboard:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get Impact Analysis for a specific Fee Structure
// @route   GET /api/fees/staff/fees/structures/:id/analysis
// @access  Private (Staff/Admin)
exports.getFeeStructureImpactAnalysis = async (req, res) => {
  try {
    const structureId = req.params.id;
    const structure = await FeeStructure.findById(structureId);
    if (!structure) return res.status(404).json({ success: false, error: 'Structure not found' });

    // 1. Adoption Stats
    const totalStudents = await StudentMaster.countDocuments({ 
        'academicProfile.course': structure.course,
        'academicProfile.yearNumber': structure.yearNumber
    });
    const assignedStudents = await StudentFeeAccount.countDocuments({ feeStructureId: structureId });
    const pendingInitCount = Math.max(0, totalStudents - assignedStudents);

    // 2. Financial Totals for this structure
    const financialStats = await StudentFeeAccount.aggregate([
      { $match: { feeStructureId: new mongoose.Types.ObjectId(structureId) } },
      {
        $group: {
          _id: null,
          totalExpected: { $sum: '$totalPayable' },
          totalCollected: { $sum: '$totalPaid' },
          totalOutstanding: { $sum: '$balance' }
        }
      }
    ]);

    // 3. Status Distribution
    const statusStats = await StudentFeeAccount.aggregate([
      { $match: { feeStructureId: new mongoose.Types.ObjectId(structureId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusMap = { paid: 0, partial: 0, unpaid: 0 };
    statusStats.forEach(s => { statusMap[s._id] = s.count; });

    // 4. Recent Payments under this structure
    const recentPayments = await FeePaymentEntry.find()
      .populate({
        path: 'feeAccountId',
        match: { feeStructureId: structureId },
        populate: { path: 'studentId', select: 'personalDetails.fullName studentId' }
      })
      .sort({ paymentDate: -1 })
      .limit(5)
      .lean();

    // Filter out payments where feeAccountId didn't match (due to population filter)
    const filteredPayments = recentPayments.filter(p => p.feeAccountId);

    res.status(200).json({
      success: true,
      data: {
        structure,
        adoption: {
          totalEligible: totalStudents,
          assigned: assignedStudents,
          pending: pendingInitCount
        },
        finances: financialStats[0] || { totalExpected: 0, totalCollected: 0, totalOutstanding: 0 },
        statusDistribution: statusMap,
        recentPayments: filteredPayments
      }
    });

  } catch (error) {
    console.error('Error in getFeeStructureImpactAnalysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get Comprehensive Accounts Reports Summary
// @route   GET /api/fees/staff/reports/accounts-summary
// @access  Private (Staff/Admin)
exports.getAccountsReportsSummary = async (req, res) => {
  try {
    // I already have getEnhancedFeeDashboard which covers a lot. 
    // This will focus on more granular report data.

    // 1. Holistic KPIs (Reused from Dashboard but for reports)
    const kpis = await StudentFeeAccount.aggregate([
      {
        $group: {
          _id: null,
          totalExpected: { $sum: '$totalPayable' },
          totalCollected: { $sum: '$totalPaid' },
          totalOutstanding: { $sum: '$balance' },
          activeAccounts: { $sum: 1 }
        }
      }
    ]);

    // 2. Course-wise Detailed Report
    const courseReport = await StudentFeeAccount.aggregate([
      {
        $lookup: {
          from: 'studentmasters',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: '$student.academicProfile.course',
          expected: { $sum: '$totalPayable' },
          collected: { $sum: '$totalPaid' },
          outstanding: { $sum: '$balance' },
          students: { $sum: 1 }
        }
      },
      { $sort: { collected: -1 } }
    ]);

    // 3. Payment Mode Breakdown
    const modeReport = await FeePaymentEntry.aggregate([
      {
        $group: {
          _id: '$paymentMode',
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. Status Breakdown
    const statusReport = await StudentFeeAccount.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // 5. Recent High Value Payments
    const highValuePayments = await FeePaymentEntry.find()
      .populate({
        path: 'feeAccountId',
        populate: { path: 'studentId', select: 'personalDetails.fullName studentId' }
      })
      .sort({ amount: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalKpis: kpis[0] || { totalExpected: 0, totalCollected: 0, totalOutstanding: 0, activeAccounts: 0 },
        courseReport,
        modeReport,
        statusReport,
        highValuePayments
      }
    });

  } catch (error) {
    console.error('Error in getAccountsReportsSummary:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};