console.log('Comprehensive Academic Module Load Test...');

const modules = [
  './src/routes/academic/academicDashboardRoutes',
  './src/routes/academic/academicStructureRoutes',
  './src/routes/academic/facultyManagementRoutes',
  './src/routes/academic/semesterManagementRoutes',
  './src/routes/academic/subjectManagementRoutes',
  './src/routes/academic/semesterSubjectMappingRoutes',
  './src/routes/academic/sectionManagementRoutes',
  './src/routes/academic/studentSemesterEnrollmentRoutes',
  './src/routes/academic/facultyAllocationRoutes',
  './src/routes/academic/timetableManagementRoutes',
  './src/routes/academic/internalMarksRoutes',
  './src/routes/academic/resultProcessingRoutes'
];

modules.forEach(m => {
  try {
    process.stdout.write(`Loading ${m}... `);
    require(m);
    console.log('OK');
  } catch (error) {
    console.log('FAILED');
    console.error(`ERROR in ${m}:`);
    console.error(error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
});

console.log('\nSUCCESS: ALL REGISTERED ROUTES LOADED');
