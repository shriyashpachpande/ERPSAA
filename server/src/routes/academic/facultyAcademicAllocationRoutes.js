const express = require('express');
const router = express.Router();
const { 
  createAllocation, 
  getAllAllocations, 
  getAllocation, 
  updateAllocation, 
  updateStatus, 
  getMyAllocations 
} = require('../../controllers/academic/facultyAcademicAllocationController');
const { protect } = require('../../middlewares/auth/authMiddleware');

router.use(protect);

router.post('/', createAllocation);
router.get('/', getAllAllocations);
router.get('/my-allocations', getMyAllocations);
router.get('/:id', getAllocation);
router.put('/:id', updateAllocation);
router.patch('/:id/status', updateStatus);

module.exports = router;
