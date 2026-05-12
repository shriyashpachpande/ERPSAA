const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middlewares/auth/authMiddleware');
const {
  getAllHostels,
  getHostelHierarchy,
  getRoomBeds,
  getAllocationReadyStudents,
  assignBed
} = require('../../controllers/hostel-management/hostelAllocationFlow.controller');

// All routes are protected and restricted to hostel_staff or super_admin
router.use(protect);
router.use(authorize('hostel_staff', 'super_admin'));

router.get('/hostels', getAllHostels);
router.get('/hierarchy/:hostelId', getHostelHierarchy);
router.get('/beds/:roomId', getRoomBeds);
router.get('/students', getAllocationReadyStudents);
router.post('/assign', assignBed);

module.exports = router;
