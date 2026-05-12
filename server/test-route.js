try {
  console.log('Loading academicDashboardRoutes...');
  require('./src/routes/academic/academicDashboardRoutes');
  console.log('SUCCESS');
} catch (error) {
  console.error('FAILED:');
  console.error(error);
  if (error.stack) console.error(error.stack);
}
