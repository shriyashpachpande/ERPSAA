const AdmissionApplication = require('../../models/admission-management/AdmissionApplication');
const mongoose = require('mongoose');

// @desc    Get admission reports overview (KPIs)
// @route   GET /api/admissions/reports/overview
// @access  Private (Staff/Admin)
exports.getReportsOverview = async (req, res) => {
  try {
    const stats = await AdmissionApplication.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          draft: { $sum: { $cond: [{ $eq: ['$applicationStatus', 'draft'] }, 1, 0] } },
          submitted: { $sum: { $cond: [{ $eq: ['$applicationStatus', 'submitted'] }, 1, 0] } },
          underReview: { $sum: { $cond: [{ $eq: ['$applicationStatus', 'under_review'] }, 1, 0] } },
          reuploadRequested: { $sum: { $cond: [{ $eq: ['$applicationStatus', 'reupload_requested'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$applicationStatus', 'approved'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$applicationStatus', 'rejected'] }, 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        total: 0, draft: 0, submitted: 0, underReview: 0,
        reuploadRequested: 0, approved: 0, rejected: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get applications breakdown by Status
// @route   GET /api/admissions/reports/status-breakdown
exports.getStatusBreakdown = async (req, res) => {
  try {
    const data = await AdmissionApplication.aggregate([
      { $group: { _id: '$applicationStatus', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get applications breakdown by Department
// @route   GET /api/admissions/reports/department-breakdown
exports.getDepartmentBreakdown = async (req, res) => {
  try {
    const data = await AdmissionApplication.aggregate([
      { $group: { _id: '$courseSelection.department', count: { $sum: 1 } } },
      { $project: { department: { $ifNull: ['$_id', 'Unassigned'] }, count: 1, _id: 0 } }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get monthly admission trends
// @route   GET /api/admissions/reports/monthly-trends
exports.getMonthlyTrends = async (req, res) => {
  try {
    const data = await AdmissionApplication.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          month: '$_id.month',
          year: '$_id.year',
          count: 1,
          _id: 0,
          label: {
            $concat: [
              { $toString: '$_id.month' },
              '/',
              { $toString: '$_id.year' }
            ]
          }
        }
      }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
