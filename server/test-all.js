const modules = [
  'express',
  'path',
  'dotenv',
  'cors',
  './src/config/db',
  './src/routes/auth/authRoutes',
  './src/routes/admission-management/admissionRoutes',
  './src/routes/notificationRoutes',
  './src/routes/admission-management/admissionReportsRoutes',
  './src/routes/student-master/studentMasterRoutes',
  './src/routes/fees-management/feeRoutes',
  './src/routes/hostel-management/hostelRoutes',
  './src/routes/hostel-management/hostelAllocationRoutes',
  './src/routes/library-management/libraryRoutes',
  './src/routes/academic/academicDashboardRoutes',
  './src/routes/academic/academicStructureRoutes',
  './src/routes/academic/facultyManagementRoutes',
  './src/routes/academic/semesterManagementRoutes',
  './src/routes/academic/subjectManagementRoutes',
  './src/routes/academic/semesterSubjectMappingRoutes',
  './src/routes/academic/sectionManagementRoutes',
  './src/routes/academic/studentSemesterEnrollmentRoutes',
  './src/routes/academic/facultyAcademicAllocationRoutes',
  './src/routes/academic/timetableManagementRoutes',
  './src/routes/academic/internalMarksRoutes',
  './src/routes/academic/resultProcessingRoutes'
];

modules.forEach(m => {
  try {
    process.stdout.write(`Loading ${m}... `);
    require(m);
    console.log('OK');
  } catch (e) {
    console.log('FAILED');
    console.error(`ERROR in ${m}: ${e.message}`);
    // console.error(e.stack);
    // process.exit(1);
  }
});
