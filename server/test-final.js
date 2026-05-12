const modules = [
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
    require(m);
  } catch (e) {
    console.log(`FAIL ${m}: ${e.message}`);
    // console.log(e.stack);
  }
});
