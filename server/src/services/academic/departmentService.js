const Department = require('../../models/academic/Department');

class DepartmentService {
  async getAllDepartments() {
    // Ensure default departments are present
    await this.seedDefaultDepartments();
    return await Department.find().sort({ name: 1 });
  }

  async getDepartmentById(id) {
    const department = await Department.findById(id);
    if (!department) throw new Error('Department not found');
    return department;
  }

  async createDepartment(data) {
    const existingCode = await Department.findOne({ code: data.code.toUpperCase() });
    if (existingCode) throw new Error('Department with this code already exists');

    const department = new Department(data);
    return await department.save();
  }

  async updateDepartment(id, data) {
    const department = await Department.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    if (!department) throw new Error('Department not found');
    return department;
  }

  async deleteDepartment(id) {
    const department = await Department.findByIdAndDelete(id);
    if (!department) throw new Error('Department not found');
    return department;
  }

  async seedDefaultDepartments() {
    const defaults = [
      { name: 'Computer Science', code: 'CS', status: 'active' },
      { name: 'Information Technology', code: 'IT', status: 'active' },
      { name: 'Electronics and Communication', code: 'ECE', status: 'active' },
      { name: 'Mechanical Engineering', code: 'ME', status: 'active' },
      { name: 'Civil Engineering', code: 'CE', status: 'active' },
      { name: 'Electrical Engineering', code: 'EE', status: 'active' },
      { name: 'Common Engineering', code: 'FE', status: 'active' },
      { name: 'Artificial Intelligence & Data Science', code: 'AIDS', status: 'active' },
      { name: 'MBA', code: 'MBA', status: 'active' },
      { name: 'MCA', code: 'MCA', status: 'active' },
      { name: 'BSc', code: 'BSC', status: 'active' },
      { name: 'BCom', code: 'BCOM', status: 'active' },
      { name: 'BA', code: 'BA', status: 'active' }
    ];

    try {
      for (const dept of defaults) {
        const exists = await Department.findOne({ code: dept.code });
        if (!exists) {
          await Department.create(dept);
          console.log(`Seeded department: ${dept.name} (${dept.code})`);
        }
      }
    } catch (error) {
      console.error('Error seeding defaults departments:', error);
    }
  }
}

module.exports = new DepartmentService();
