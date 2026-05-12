try {
  console.log('Testing connectDB...');
  require('./src/config/db');
  console.log('Testing authRoutes...');
  require('./src/routes/auth/authRoutes');
  console.log('Testing admissionRoutes dependencies...');
  console.log('  Testing admissionController...');
  require('./src/controllers/admission-management/admissionController');
  console.log('  Testing authMiddleware...');
  require('./src/middlewares/auth/authMiddleware');
  console.log('  Testing uploadMiddleware...');
  require('./src/middlewares/upload/uploadMiddleware');
  console.log('Testing admissionRoutes final...');
  require('./src/routes/admission-management/admissionRoutes');
  console.log('Testing notificationRoutes...');
  require('./src/routes/notificationRoutes');
  console.log('Testing admissionReportsRoutes...');
  require('./src/routes/admission-management/admissionReportsRoutes');
  console.log('All top-level imports successful!');
} catch (error) {
  console.error('Import failed:');
  console.error(error);
}
