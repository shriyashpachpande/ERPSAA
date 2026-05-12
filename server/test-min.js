try {
  console.log('1. Loading FacultyProfile Model...');
  require('./src/models/academic/FacultyProfile');
  console.log('2. Loading StudentMaster Model...');
  require('./src/models/student-master/StudentMaster');
  console.log('3. Loading academicDashboardService...');
  require('./src/services/academic/academicDashboardService');
  console.log('4. Loading academicDashboardController...');
  require('./src/controllers/academic/academicDashboardController');
  console.log('5. Loading academicDashboardRoutes...');
  require('./src/routes/academic/academicDashboardRoutes');
  console.log('SUCCESS');
} catch (error) {
  console.error('FAILED:');
  console.error(error.message);
  if (error.stack) console.error(error.stack);
}
