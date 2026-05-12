const AdmissionApplication = require('../../models/admission-management/AdmissionApplication');
const User = require('../../models/auth/User');
const Notification = require('../../models/Notification');
const mongoose = require('mongoose');

// Helper to get formatted date string
const formatDate = (date) => date.toISOString().split('T')[0];

// @desc    Get dashboard KPI statistics
// @route   GET /api/admissions/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await AdmissionApplication.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          submittedToday: [
            { $match: { submittedAt: { $gte: today } } },
            { $count: 'count' }
          ],
          underReview: [
            { $match: { applicationStatus: 'under_review' } },
            { $count: 'count' }
          ],
          reuploadRequested: [
            { $match: { applicationStatus: 'reupload_requested' } },
            { $count: 'count' }
          ],
          approved: [
            { $match: { applicationStatus: 'approved' } },
            { $count: 'count' }
          ],
          rejected: [
            { $match: { applicationStatus: 'rejected' } },
            { $count: 'count' }
          ],
          statusBreakdown: [
            { $group: { _id: '$applicationStatus', count: { $sum: 1 } } },
            { $project: { status: '$_id', count: 1, _id: 0 } }
          ]
        }
      }
    ]);

    const data = stats[0];
    res.json({
      success: true,
      data: {
        kpis: {
          total: data.total[0]?.count || 0,
          submittedToday: data.submittedToday[0]?.count || 0,
          underReview: data.underReview[0]?.count || 0,
          reuploadRequested: data.reuploadRequested[0]?.count || 0,
          approved: data.approved[0]?.count || 0,
          rejected: data.rejected[0]?.count || 0
        },
        statusBreakdown: data.statusBreakdown || []
      }
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get last 7 days trends
// @route   GET /api/admissions/dashboard/trend
exports.getDashboardTrend = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trendsRaw = await AdmissionApplication.aggregate([
      {
        $match: {
          $or: [
            { submittedAt: { $gte: sevenDaysAgo } },
            { approvedAt: { $gte: sevenDaysAgo } }
          ]
        }
      },
      {
        $facet: {
          submitted: [
            { $match: { submittedAt: { $ne: null } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' } }, count: { $sum: 1 } } }
          ],
          approved: [
            { $match: { approvedAt: { $ne: null } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$approvedAt' } }, count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const trendData = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = formatDate(d);
        
        const sub = trendsRaw[0]?.submitted?.find(t => t._id === dayStr)?.count || 0;
        const app = trendsRaw[0]?.approved?.find(t => t._id === dayStr)?.count || 0;
        
        trendData.unshift({
            date: dayStr,
            displayDate: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
            submitted: sub,
            approved: app
        });
    }

    res.json({ success: true, data: trendData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get recent applications
// @route   GET /api/admissions/dashboard/recent
exports.getDashboardRecent = async (req, res) => {
  try {
    const recent = await AdmissionApplication.find({})
      .populate('linkedUserId', 'fullName email profileImage')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ success: true, data: recent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get activity feed
// @route   GET /api/admissions/dashboard/activity
exports.getDashboardActivity = async (req, res) => {
  try {
    // Return notifications related to admission process for staff
    const activity = await Notification.find({ 
      $or: [
        { recipient: req.user.id },
        { type: { $in: ['NEW_APPLICATION', 'DOCUMENT_REUPLOAD', 'APPLICATION_SUBMITTED'] } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get admission funnel
// @route   GET /api/admissions/dashboard/funnel
exports.getDashboardFunnel = async (req, res) => {
  try {
    const inquiries = await User.countDocuments({ role: 'student' });
    const started = await AdmissionApplication.countDocuments({ applicationStatus: 'draft' });
    const submitted = await AdmissionApplication.countDocuments({ applicationStatus: { $ne: 'draft' } });
    const approved = await AdmissionApplication.countDocuments({ applicationStatus: 'approved' });
    
    const funnelData = [
        { stage: 'Inquiries', count: inquiries, color: '#3b82f6' },
        { stage: 'Started', count: started, color: '#8b5cf6' },
        { stage: 'Submitted', count: submitted, color: '#f59e0b' },
        { stage: 'Approved', count: approved, color: '#10b981' }
    ];

    res.json({ success: true, data: funnelData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
