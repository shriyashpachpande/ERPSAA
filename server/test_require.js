try {
    console.log('Testing express...');
    require('express');
    console.log('Testing admissionReportsController...');
    require('./src/controllers/admission-management/admissionReportsController');
    console.log('Testing authMiddleware...');
    require('./src/middlewares/auth/authMiddleware');
    console.log('All modules loaded successfully!');
} catch (error) {
    console.error('Error loading module:', error);
}
