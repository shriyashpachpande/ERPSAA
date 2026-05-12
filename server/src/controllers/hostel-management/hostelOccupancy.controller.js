const mongoose = require('mongoose');
const Hostel = require('../../models/hostel-management/Hostel');
const HostelBlock = require('../../models/hostel-management/HostelBlock');
const HostelFloor = require('../../models/hostel-management/HostelFloor');
const HostelRoom = require('../../models/hostel-management/HostelRoom');
const HostelBed = require('../../models/hostel-management/HostelBed');

// @desc    Get detailed occupancy for a specific hostel
// @route   GET /api/hostel/staff/occupancy/:hostelId
// @access  Private (Hostel Staff)
exports.getHostelOccupancy = async (req, res) => {
  try {
    const { hostelId } = req.params;
    
    if (!hostelId || hostelId === 'null' || !mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ success: false, error: 'Invalid Hostel ID provided' });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, error: 'Hostel not found' });
    }

    const blocks = await HostelBlock.find({ hostelId });
    
    const occupancyData = await Promise.all(blocks.map(async (block) => {
      const floors = await HostelFloor.find({ blockId: block._id });
      
      const floorData = await Promise.all(floors.map(async (floor) => {
        const rooms = await HostelRoom.find({ floorId: floor._id }).populate({
          path: 'floorId',
          select: 'floorNumber name'
        });

        const roomDetails = await Promise.all(rooms.map(async (room) => {
          const beds = await HostelBed.find({ roomId: room._id }).populate('currentStudent', 'personalDetails.fullName studentId');
          return {
            ...room._doc,
            beds
          };
        }));

        return {
          ...floor._doc,
          rooms: roomDetails
        };
      }));

      return {
        ...block._doc,
        floors: floorData
      };
    }));

    res.status(200).json({
      success: true,
      data: {
        hostel,
        blocks: occupancyData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all hostels with occupancy summary
// @route   GET /api/hostel/staff/hostels-summary
// @access  Private (Hostel Staff)
exports.getHostelsSummary = async (req, res) => {
    try {
      const hostels = await Hostel.find({ isActive: true });
      
      const summary = await Promise.all(hostels.map(async (hostel) => {
        const rooms = await HostelRoom.aggregate([
          {
            $lookup: {
              from: 'hostelfloors',
              localField: 'floorId',
              foreignField: '_id',
              as: 'floor'
            }
          },
          { $unwind: '$floor' },
          {
            $lookup: {
              from: 'hostelblocks',
              localField: 'floor.blockId',
              foreignField: '_id',
              as: 'block'
            }
          },
          { $unwind: '$block' },
          { $match: { 'block.hostelId': hostel._id } },
          {
            $group: {
              _id: null,
              capacity: { $sum: '$capacity' },
              occupied: { $sum: '$occupiedCount' },
              totalRooms: { $sum: 1 }
            }
          }
        ]);
  
        const stats = rooms[0] || { capacity: 0, occupied: 0, totalRooms: 0 };
        
        // Explicitly construct the response object to avoid any spread-related ID issues
        return {
          _id: hostel._id.toString(),
          name: hostel.name,
          type: hostel.type,
          capacity: stats.capacity || 0,
          occupied: stats.occupied || 0,
          totalRooms: stats.totalRooms || 0,
          isActive: hostel.isActive,
          createdAt: hostel.createdAt,
          updatedAt: hostel.updatedAt
        };
      }));
  
      res.set('X-Hostel-Summary-Version', '3.0-BULLETPROOF');
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
