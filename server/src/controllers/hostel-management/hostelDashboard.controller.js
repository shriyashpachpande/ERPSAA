const Hostel = require('../../models/hostel-management/Hostel');
const HostelRoom = require('../../models/hostel-management/HostelRoom');
const HostelBed = require('../../models/hostel-management/HostelBed');
const HostelApplication = require('../../models/hostel-management/HostelApplication');
const HostelComplaint = require('../../models/hostel-management/HostelComplaint');
const HostelMaintenance = require('../../models/hostel-management/HostelMaintenance');

// @desc    Get Hostel Staff Dashboard Stats
// @route   GET /api/hostel/staff/dashboard
// @access  Private (Hostel Staff)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalHostels = await Hostel.countDocuments({ isActive: true });
    
    const occupancyStats = await HostelRoom.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity' },
          totalOccupied: { $sum: '$occupiedCount' }
        }
      }
    ]);

    const { totalCapacity = 0, totalOccupied = 0 } = occupancyStats[0] || {};

    const pendingApplications = await HostelApplication.countDocuments({ status: 'Pending' });
    const activeComplaints = await HostelComplaint.countDocuments({ status: { $in: ['Pending', 'In-Progress'] } });
    const activeMaintenance = await HostelMaintenance.countDocuments({ status: { $in: ['Pending', 'Assigned', 'In-Progress'] } });

    // Gender-wise stats
    const genderStats = await Hostel.aggregate([
      {
        $lookup: {
          from: 'hostelblocks',
          localField: '_id',
          foreignField: 'hostelId',
          as: 'blocks'
        }
      },
      { $unwind: '$blocks' },
      {
        $lookup: {
          from: 'hostelfloors',
          localField: 'blocks._id',
          foreignField: 'blockId',
          as: 'floors'
        }
      },
      { $unwind: '$floors' },
      {
        $lookup: {
          from: 'hostelrooms',
          localField: 'floors._id',
          foreignField: 'floorId',
          as: 'rooms'
        }
      },
      { $unwind: '$rooms' },
      {
        $group: {
          _id: '$type',
          capacity: { $sum: '$rooms.capacity' },
          occupied: { $sum: '$rooms.occupiedCount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalHostels,
        totalCapacity,
        totalOccupied,
        vacantBeds: totalCapacity - totalOccupied,
        pendingApplications,
        activeComplaints,
        activeMaintenance,
        genderStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
