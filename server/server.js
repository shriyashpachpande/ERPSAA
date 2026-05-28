const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
const authRoutes = require('./src/routes/auth/authRoutes');
const admissionRoutes = require('./src/routes/admission-management/admissionRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const admissionReportsRoutes = require('./src/routes/admission-management/admissionReportsRoutes');
const studentMasterRoutes = require('./src/routes/student-master/studentMasterRoutes');
const feeRoutes = require('./src/routes/fees-management/feeRoutes');
const hostelRoutes = require('./src/routes/hostel-management/hostelRoutes');
const hostelAllocationRoutes = require('./src/routes/hostel-management/hostelAllocationRoutes');
const libraryRoutes = require('./src/routes/library-management/libraryRoutes');
const complaintRoutes = require('./src/routes/complaint-management/complaintManagementRoutes');

// Leave & Health Management Routes
const leaveRoutes = require('./src/modules/leave/leaveRoutes');
const healthRoutes = require('./src/modules/leave/healthRoutes');

// Events / Facility Booking Routes
const eventsFacilitiesRoutes = require('./src/routes/eventsFacilities/index');

// Academic Management Routes
const academicDashboardRoutes = require('./src/routes/academic/academicDashboardRoutes');
const academicStructureRoutes = require('./src/routes/academic/academicStructureRoutes');
const facultyManagementRoutes = require('./src/routes/academic/facultyManagementRoutes');
const semesterManagementRoutes = require('./src/routes/academic/semesterManagementRoutes');
const subjectManagementRoutes = require('./src/routes/academic/subjectManagementRoutes');
const semesterSubjectMappingRoutes = require('./src/routes/academic/semesterSubjectMappingRoutes');
const sectionManagementRoutes = require('./src/routes/academic/sectionManagementRoutes');
const studentEnrollmentRoutes = require('./src/routes/academic/studentSemesterEnrollmentRoutes');
const facultyAllocationRoutes = require('./src/routes/academic/facultyAcademicAllocationRoutes');
const timetableRoutes = require('./src/routes/academic/timetableManagementRoutes');
const internalMarksRoutes = require('./src/routes/academic/internalMarksRoutes');
const resultProcessingRoutes = require('./src/routes/academic/resultProcessingRoutes');
const attendanceRoutes = require('./src/modules/academic/attendance/routes/attendanceRoutes');
const dashboardRoutes = require('./src/routes/dashboard/dashboardRoutes');
const bonafideRoutes = require('./src/routes/academic/bonafideRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admissions/reports', admissionReportsRoutes);
app.use('/api/student-master', studentMasterRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/hostel/allocation', hostelAllocationRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/eventsFacilities', eventsFacilitiesRoutes);

// Academic Management API mounts
const departmentRoutes = require('./src/routes/academic/departmentRoutes');
app.use('/api/academic/departments', departmentRoutes);
app.use('/api/academic/dashboard', academicDashboardRoutes);
app.use('/api/academic/structure', academicStructureRoutes);
app.use('/api/academic/faculty', facultyManagementRoutes);
app.use('/api/academic/semesters', semesterManagementRoutes);
app.use('/api/academic/subjects', subjectManagementRoutes);
app.use('/api/academic/semester-subject-mappings', semesterSubjectMappingRoutes);
app.use('/api/academic/sections', sectionManagementRoutes);
app.use('/api/academic/enrollments', studentEnrollmentRoutes);
app.use('/api/academic/faculty-allocations', facultyAllocationRoutes);
app.use('/api/academic/timetable', timetableRoutes);
app.use('/api/academic/internal-marks', internalMarksRoutes);
app.use('/api/academic/results', resultProcessingRoutes);
app.use('/api/academic/attendance', attendanceRoutes);
app.use('/api/academic/bonafide', bonafideRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('ERPSAA API is running...');
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
