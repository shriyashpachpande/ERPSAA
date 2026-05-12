const express = require('express');
const router = express.Router();
const departmentController = require('../../controllers/academic/departmentController');

router.route('/')
  .get(departmentController.getAllDepartments)
  .post(departmentController.createDepartment);

router.route('/:id')
  .get(departmentController.getDepartment)
  .put(departmentController.updateDepartment)
  .delete(departmentController.deleteDepartment);

module.exports = router;
