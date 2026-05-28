import { useState, useEffect } from 'react';

// Simulated Layouts (To be created)
import PublicLayout from './layouts/public/PublicLayout';
import AuthLayout from './layouts/auth/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Lenis from '@studio-freight/lenis';
// Simulated Pages (To be created)
import LandingPage from './pages/public/landing/LandingPage';
import CollegeProfilePage from './modules/CollegeProfile/CollegeProfilePage';
import AppliedSciencePage from './modules/CollegeProfile/AppliedSciencePage';
import CivilEngineeringPage from './modules/CollegeProfile/CivilEngineeringPage';
import ComputerSciencePage from './modules/CollegeProfile/ComputerSciencePage';
import ElectronicsTelecommPage from './modules/CollegeProfile/ElectronicsTelecommPage';
import InformationTechnologyPage from './modules/CollegeProfile/InformationTechnologyPage';
import MechanicalEngineeringPage from './modules/CollegeProfile/MechanicalEngineeringPage';
import TrainingPlacementPage from './modules/CollegeProfile/TrainingPlacementPage';
import LoginPage from './pages/auth/login/LoginPage';
import ForgotPasswordPage from './pages/auth/forgot-password/ForgotPasswordPage';

// About Module Imports
import AboutUs from './modules/About/pages/AboutUs';
import VisionMission from './modules/About/pages/VisionMission';
import CoreValues from './modules/About/pages/CoreValues';
import ChairmanDirector from './modules/About/pages/ChairmanDirector';
import CoursesOffered from './modules/About/pages/CoursesOffered';
import History from './modules/About/pages/History';
import Location from './modules/About/pages/Location';
import Accreditations from './modules/About/pages/Accreditations';
import GoverningCouncil from './modules/About/pages/GoverningCouncil';
import PressCoverage from './modules/About/pages/PressCoverage';
import ServiceRules from './modules/About/pages/ServiceRules';
import CellsCommittees from './modules/About/pages/CellsCommittees';
import CampusGallery from './modules/About/pages/CampusGallery';
import DashboardHome from './pages/dashboard/DashboardHome';
import Chatbot from './components/ui/Chatbot';
import ScrollToTop from './components/navigation/ScrollToTop';


// Deep RBAC Routes
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admission Management Pages (Student)
import AdmissionFormPage from './modules/admission-management/pages/student/AdmissionFormPage';
import AdmissionStatusTrackerPage from './modules/admission-management/pages/student/AdmissionStatusTrackerPage';
import MyDocumentsPage from './modules/admission-management/pages/student/MyDocumentsPage';

// Admission Management Pages (Staff)
import ApplicationsListPage from './modules/admission-management/pages/staff/ApplicationsListPage';
import ApplicationDetailPage from './modules/admission-management/pages/staff/ApplicationDetailPage';
import ReviewPanelPage from './modules/admission-management/pages/staff/ReviewPanelPage';
import CreateApplicantAccountPage from './modules/admission-management/pages/staff/CreateApplicantAccountPage';
import ReviewQueuePage from './modules/admission-management/pages/staff/ReviewQueuePage';
import StaffBonafideDashboardPage from './modules/admission-management/pages/staff/StaffBonafideDashboardPage';
import ReportsPage from './modules/admission-management/pages/staff/ReportsPage';
import StaffNotificationsPage from './modules/notifications/pages/StaffNotificationsPage';
import ProfilePage from './pages/profile/ProfilePage';

// ===============================================
// MODULE 2: STUDENT MASTER UNIFIED PROFILES
// ===============================================
import MyMasterProfilePage from './modules/student-master/pages/student/MyMasterProfilePage';
import StudentDirectoryPage from './modules/student-master/pages/staff/StudentDirectoryPage';
import StudentMasterDetailPanel from './modules/student-master/pages/staff/StudentMasterDetailPanel';
// ===============================================
// MODULE 3: FEE MANAGEMENT + DIGITAL RECEIPT
// ===============================================
import StudentFeeOverviewPage from './modules/fees-management/pages/student/StudentFeeOverviewPage';
import StudentFeeReceiptHistoryPage from './modules/fees-management/pages/student/StudentFeeReceiptHistoryPage';
import FeeManagementDashboardPage from './modules/fees-management/pages/staff/FeeManagementDashboardPage';
import FeeStudentDirectoryPage from './modules/fees-management/pages/staff/FeeStudentDirectoryPage';
import FeeStudentAccountDetailPage from './modules/fees-management/pages/staff/FeeStudentAccountDetailPage';
import FeeStructureManagementPage from './modules/fees-management/pages/staff/FeeStructureManagementPage';
import FeeStructureImpactAnalysis from './modules/fees-management/pages/staff/FeeStructureImpactAnalysis';
import AccountsReportsPage from './modules/fees-management/pages/staff/AccountsReportsPage';
import DigitalReceiptPage from './modules/fees-management/pages/student/DigitalReceiptPage';

// ===============================================
// MODULE 4: HOSTEL MANAGEMENT
// ===============================================
import HostelApplicationPage from './modules/hostel-management/pages/student/HostelApplicationPage';
import MyHostelStatusPage from './modules/hostel-management/pages/student/MyHostelStatusPage';
import HostelDashboardPage from './modules/hostel-management/pages/staff/HostelDashboardPage';
import HostelApplicantsPage from './modules/hostel-management/pages/staff/HostelApplicantsPage';
import RoomAllocationPage from './modules/hostel-management/pages/staff/RoomAllocationPage';
import MyRoomDetailsPage from './modules/hostel-management/pages/student/MyRoomDetailsPage';
import EmergencyContactPage from './modules/hostel-management/pages/student/EmergencyContactPage';
import HostelHistoryPage from './modules/hostel-management/pages/student/HostelHistoryPage';
import HostelComplaintsPage from './modules/hostel-management/pages/student/HostelComplaintsPage';
import MaintenanceRequestsPage from './modules/hostel-management/pages/student/MaintenanceRequestsPage';

import {
  OccupancyAnalyticsPage,
  CheckInCheckOutPage,
  HostelStaffComplaintsPage as HostelStaffComplaints,
  MaintenanceRequestsPage as HostelStaffMaintenance,
  RoomDetailsPage as StaffRoomDetails,
  EmergencyContactsPage as StaffEmergency
} from './modules/hostel-management/pages/staff/HostelOperations';

// ===============================================
// MODULE: LIBRARY MANAGEMENT
// ===============================================
import LibraryDashboard from './modules/library/library_staff/LibraryDashboard';
import StaffBookCatalog from './modules/library/library_staff/StaffBookCatalog';
import IssueBookPage from './modules/library/library_staff/IssueBookPage';
import ReturnBookPage from './modules/library/library_staff/ReturnBookPage';
import IssuedBooksList from './modules/library/library_staff/IssuedBooksList';
import StaffBookDetails from './modules/library/library_staff/StaffBookDetails';

import StudentBookCatalog from './modules/library/student/BookCatalog';
import MyIssuedBooks from './modules/library/student/MyIssuedBooks';
import LibraryHistory from './modules/library/student/LibraryHistory';

import LibraryOverview from './modules/library/admin/LibraryOverview';

// Phase 2 Library Imports
import FinePage from './modules/library/student/FinePage';
import StudentReservationsPage from './modules/library/student/ReservationsPage';
import LibraryNotificationsView from './modules/library/student/NotificationsView';
import StudentBookRequestPage from './modules/library/student/BookRequestPage';
import BookDetails from './modules/library/student/BookDetails';

import FineManagementPage from './modules/library/library_staff/FineManagementPage';
import StaffReservationManagementPage from './modules/library/library_staff/ReservationManagementPage';
import StaffLostDamagedPage from './modules/library/library_staff/LostDamagedPage';

import PolicyPage from './modules/library/admin/PolicyPage';
import AdminBookRequestReviewPage from './modules/library/admin/BookRequestReviewPage';
import AdminLibraryAnalyticsPage from './modules/library/admin/LibraryAnalyticsPage';
import AdminAuditLogsPage from './modules/library/admin/AuditLogsPage';

// Issue Request Pages
import IssueRequestsReviewPage from './modules/library/library_staff/IssueRequestsReviewPage';
import MyIssueRequests from './modules/library/student/MyIssueRequests';

// ===============================================
// MODULE: ACADEMIC MANAGEMENT
// ===============================================
import AcademicDashboardPage from './modules/academic/pages/AcademicDashboardPage';
import AcademicYearsPage from './modules/academic/pages/AcademicYearsPage';
import SemestersPage from './modules/academic/pages/SemestersPage';
import SubjectsPage from './modules/academic/pages/SubjectsPage';
import FacultyManagementPage from './modules/academic/pages/FacultyManagementPage';
import AcademicSectionsPage from './modules/academic/pages/AcademicSectionsPage';
import MyMenteesPage from './modules/academic/pages/MyMenteesPage';
import SemesterSubjectMappingPage from './modules/academic/pages/SemesterSubjectMappingPage';
import StudentSemesterEnrollmentsPage from './modules/academic/pages/StudentSemesterEnrollmentsPage';
import StudentAcademicProfilePage from './modules/academic/pages/StudentAcademicProfilePage';
import FacultyAcademicAllocationsPage from './modules/academic/pages/FacultyAcademicAllocationsPage';
import TimetableManagementPage from './modules/academic/pages/TimetableManagementPage';
import MyFacultyTimetablePage from './modules/academic/pages/MyFacultyTimetablePage';
import MyStudentTimetablePage from './modules/academic/pages/MyStudentTimetablePage';
import MarkAttendancePage from './modules/academic/attendance/pages/MarkAttendancePage';
import StudentAttendancePage from './modules/academic/attendance/pages/StudentAttendancePage';
import InternalMarksManagementPage from './modules/academic/pages/InternalMarksManagementPage';
import ResultProcessingPage from './modules/academic/pages/ResultProcessingPage';
import NewEnrollmentPage from './modules/academic/pages/NewEnrollmentPage';
import MyInternalMarksPage from './modules/academic/pages/MyInternalMarksPage';
import MyResultsPage from './modules/academic/pages/MyResultsPage';
import StudentBonafidePage from './modules/academic/pages/StudentBonafidePage';
import HODFacultyDetailsPage from './modules/academic/pages/HODFacultyDetailsPage';
import TeachingSubjectsPage from './modules/academic/pages/TeachingSubjectsPage';
import SyllabusManagementPage from './modules/academic/pages/SyllabusManagementPage';

// ===============================================
// MODULE: COMPLAINT MANAGEMENT
// ===============================================
import RaiseComplaintPage from './modules/complaint-management/pages/student/RaiseComplaintPage';
import MyComplaintsPage from './modules/complaint-management/pages/student/MyComplaintsPage';
import ComplaintStatusPage from './modules/complaint-management/pages/student/ComplaintStatusPage';
import ComplaintStatusTrackingPage from './modules/complaint-management/pages/student/ComplaintStatusTrackingPage';
import ComplaintDetailPage from './modules/complaint-management/pages/student/ComplaintDetailPage';

import ComplaintAdminDashboard from './modules/complaint-management/pages/staff/ComplaintAdminDashboard';
import AssignedComplaintsPage from './modules/complaint-management/pages/staff/AssignedComplaintsPage';
import DepartmentQueuePage from './modules/complaint-management/pages/staff/DepartmentQueuePage';
import StaffComplaintDetailPage from './modules/complaint-management/pages/staff/StaffComplaintDetailPage';

// ===============================================
// MODULE: LEAVE & HEALTH NOTIFICATION
// ===============================================
import StudentLeaveApplyPage from './modules/leave/student/StudentLeaveApplyPage';
import StudentLeaveHistoryPage from './modules/leave/student/StudentLeaveHistoryPage';
import LeaveRequestsPage from './modules/leave/staff/LeaveRequestsPage';
import HealthIncidentPage from './modules/leave/HealthIncidentPage';
import LeaveAnalyticsPage from './modules/leave/admin/LeaveAnalyticsPage';

// ===============================================
// MODULE: EVENT APPROVAL & FACILITY BOOKING
// ===============================================
import StudentFacilityHomePage from './modules/eventsFacilities/pages/student/StudentFacilityHomePage';
import StudentFacilityDetailPage from './modules/eventsFacilities/pages/student/StudentFacilityDetailPage';
import StudentMyFacilityRequestsPage from './modules/eventsFacilities/pages/student/StudentMyFacilityRequestsPage';
import StudentApprovedBookingsPage from './modules/eventsFacilities/pages/student/StudentApprovedBookingsPage';
import StudentBookingHistoryPage from './modules/eventsFacilities/pages/student/StudentBookingHistoryPage';
import SportsTeacherApprovalDashboardPage from './modules/eventsFacilities/pages/sportsTeacher/SportsTeacherApprovalDashboardPage';
import AdminFacilityMasterPage from './modules/eventsFacilities/pages/admin/AdminFacilityMasterPage';

// Sport Teacher Pages
import SportTeacherFacilitySchedulePage from './modules/eventsFacilities/pages/sportsTeacher/SportTeacherFacilitySchedulePage';
import SportTeacherConflictManagementPage from './modules/eventsFacilities/pages/sportsTeacher/SportTeacherConflictManagementPage';
// =============================================================================================================================================



// // main.jsx
// import Lenis from '@studio-freight/lenis';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

// const lenis = new Lenis({
//   duration: 1.6,
//   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo — ekdam butter
//   smooth: true,
//   smoothTouch: false,
// });

// lenis.on('scroll', ScrollTrigger.update);

// gsap.ticker.add((time) => lenis.raf(time * 1000));
// gsap.ticker.lagSmoothing(0);
















// =============================================================================================================================================
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      lerp: 0.1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/collegeprofile" element={<CollegeProfilePage />} />

            {/* About Routes */}
            <Route path="/about/us" element={<AboutUs />} />
            <Route path="/about/vision-mission" element={<VisionMission />} />
            <Route path="/about/core-values" element={<CoreValues />} />
            <Route path="/about/leadership" element={<ChairmanDirector />} />
            <Route path="/about/courses" element={<CoursesOffered />} />
            <Route path="/about/history" element={<History />} />
            <Route path="/about/location" element={<Location />} />
            <Route path="/about/accreditations" element={<Accreditations />} />
            <Route path="/about/governing-council" element={<GoverningCouncil />} />
            <Route path="/about/press" element={<PressCoverage />} />
            <Route path="/about/service-rules" element={<ServiceRules />} />
            <Route path="/about/gallery" element={<CampusGallery />} />
            <Route path="/about/cells-committees/:id" element={<CellsCommittees />} />
            <Route path="/collegeprofile/applied-science" element={<AppliedSciencePage />} />
            <Route path="/collegeprofile/civil" element={<CivilEngineeringPage />} />
            <Route path="/collegeprofile/cse" element={<ComputerSciencePage />} />
            <Route path="/collegeprofile/ect" element={<ElectronicsTelecommPage />} />
            <Route path="/collegeprofile/it" element={<InformationTechnologyPage />} />
            <Route path="/collegeprofile/mechanical" element={<MechanicalEngineeringPage />} />
            <Route path="/collegeprofile/training-placement" element={<TrainingPlacementPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Dashboard Basic Routes (Protected for all logged-in users) */}
          <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />

            {/* ================================== */}
            {/* STAFF & ADMIN ROUTES               */}
            {/* ================================== */}
            {/* SHARED STAFF ROUTES (Reports, Profile) */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admission_staff', 'accounts_staff', 'staff_account', 'sport_teacher']} />}>
              <Route path="staff/reports" element={
                <ProtectedRoute
                  allowedRoles={['staff_account', 'accounts_staff']}
                  fallback={<ReportsPage />}
                >
                  <AccountsReportsPage />
                </ProtectedRoute>
              } />
              <Route path="staff/profile" element={<ProfilePage />} />
            </Route>

            {/* COMPLAINT STAFF & ADMIN ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin', 'academic_admin', 'hod', 'faculty', 'library_staff', 'accounts_staff', 'staff_account', 'hostel_staff', 'admission_staff']} />}>
              <Route path="staff/complaints/dashboard" element={<ComplaintAdminDashboard />} />
              <Route path="staff/complaints/assigned" element={<AssignedComplaintsPage />} />
              <Route path="staff/complaints/department" element={<DepartmentQueuePage />} />
              <Route path="staff/complaints/all" element={<DepartmentQueuePage all={true} />} />
              <Route path="staff/complaints/resolved" element={<DepartmentQueuePage status="resolved" />} />
              <Route path="staff/complaints/escalated" element={<DepartmentQueuePage escalated={true} />} />
              <Route path="staff/complaints/settings" element={<ComplaintAdminDashboard settings={true} />} />
              <Route path="staff/complaints/details/:id" element={<StaffComplaintDetailPage />} />
            </Route>

            {/* ADMISSION & ADMIN SPECIFIC ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admission_staff']} />}>
              <Route path="staff/admissions" element={<ApplicationsListPage />} />
              <Route path="staff/admissions/:id" element={<ApplicationDetailPage />} />
              <Route path="staff/admissions/review/:id" element={<ReviewPanelPage />} />
              <Route path="staff/new-admission" element={<CreateApplicantAccountPage />} />
              <Route path="staff/review-queue" element={<ReviewQueuePage />} />
              <Route path="staff/notifications" element={<StaffNotificationsPage />} />
              {/* MODULE 2: STAFF MASTER DIRECTORY */}
              <Route path="staff/student-directory" element={<StudentDirectoryPage />} />
              <Route path="staff/student-directory/:studentId" element={<StudentMasterDetailPanel />} />
            </Route>

            {/* EXCLUSIVE ADMISSION STAFF BONAFIDE CERTIFICATES */}
            <Route element={<ProtectedRoute allowedRoles={['admission_staff']} />}>
              <Route path="staff/bonafide" element={<StaffBonafideDashboardPage />} />
            </Route>

            {/* MODULE 3: STAFF FEE MANAGEMENT (Decoupled from Admission Staff) */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'accounts_staff', 'staff_account']} />}>
              <Route path="staff/fees/dashboard" element={<FeeManagementDashboardPage />} />
              <Route path="staff/fees/structures" element={<FeeStructureManagementPage />} />
              <Route path="staff/fees/structures/analysis/:id" element={<FeeStructureImpactAnalysis />} />
              <Route path="staff/fees/directory" element={<FeeStudentDirectoryPage />} />
              <Route path="staff/fees/students/:id" element={<FeeStudentAccountDetailPage />} />
            </Route>

            {/* MODULE 4: HOSTEL STAFF ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'hostel_staff']} />}>
              <Route path="hostel/dashboard" element={<HostelDashboardPage />} />
              <Route path="hostel/applicants" element={<HostelApplicantsPage />} />
              <Route path="hostel/allocation" element={<RoomAllocationPage />} />
              <Route path="hostel/occupancy" element={<OccupancyAnalyticsPage />} />
              <Route path="hostel/check-in-out" element={<CheckInCheckOutPage />} />
              <Route path="hostel/complaints" element={<HostelStaffComplaints />} />
              <Route path="hostel/maintenance" element={<HostelStaffMaintenance />} />
              <Route path="hostel/rooms" element={<StaffRoomDetails />} />
              <Route path="hostel/emergency" element={<StaffEmergency />} />
            </Route>

            {/* MODULE: LIBRARY STAFF ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'library_staff']} />}>
              <Route path="library/dashboard" element={<LibraryDashboard />} />
              <Route path="library/catalog" element={<StaffBookCatalog />} />
              <Route path="library/book/:bookId" element={<StaffBookDetails />} />
              <Route path="library/issue" element={<IssueBookPage />} />
              <Route path="library/return" element={<ReturnBookPage />} />
              <Route path="library/issued-list" element={<IssuedBooksList />} />
              <Route path="library/issue-requests" element={<IssueRequestsReviewPage />} />

              {/* Phase 2 Library Staff */}
              <Route path="library/fine-management" element={<FineManagementPage />} />
              <Route path="library/reservation-management" element={<StaffReservationManagementPage />} />
              <Route path="library/lost-damaged" element={<StaffLostDamagedPage />} />
            </Route>

            {/* MODULE: ADMIN LIBRARY ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
              <Route path="admin/library/overview" element={<LibraryOverview />} />
              <Route path="admin/library/catalog" element={<StaffBookCatalog />} />

              {/* Phase 2 Admin Library */}
              <Route path="admin/library/policies" element={<PolicyPage />} />
              <Route path="admin/library/book-requests" element={<AdminBookRequestReviewPage />} />
              <Route path="admin/library/analytics" element={<AdminLibraryAnalyticsPage />} />
              <Route path="admin/library/audit-logs" element={<AdminAuditLogsPage />} />
            </Route>

            {/* ================================== */}
            {/* ACADEMIC MANAGEMENT ROUTES        */}
            {/* ================================== */}
            {/* Full Academic Admin & Super Admin only */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'academic_admin', 'hod']} />}>
              <Route path="academic/years" element={<AcademicYearsPage />} />
              <Route path="academic/semesters" element={<SemestersPage />} />
              <Route path="academic/subject-mapping" element={<SemesterSubjectMappingPage />} />
              <Route path="academic/enrollments" element={<StudentSemesterEnrollmentsPage />} />
              <Route path="academic/enrollments/new" element={<NewEnrollmentPage />} />
              <Route path="academic/enrollments/edit/:id" element={<NewEnrollmentPage />} />
              <Route path="academic/faculty-allocations" element={<FacultyAcademicAllocationsPage />} />
            </Route>

            {/* Shared Across Academic Admin, Super Admin, and HOD */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'academic_admin', 'hod']} />}>
              <Route path="academic/faculty" element={<FacultyManagementPage />} />
              <Route path="academic/hod/faculty" element={<HODFacultyDetailsPage />} />
              <Route path="academic/timetable" element={<TimetableManagementPage />} />
              <Route path="academic/sections" element={<AcademicSectionsPage />} />
            </Route>

            {/* Shared Across ALL Academic roles (Super, Admin, HOD, Faculty) */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'academic_admin', 'hod', 'faculty']} />}>
              <Route path="academic/dashboard" element={<AcademicDashboardPage />} />
              <Route path="academic/subjects" element={<SubjectsPage />} />
              <Route path="academic/my-mentees" element={<MyMenteesPage />} />
              <Route path="academic/student-academic-profile/:studentId" element={<StudentAcademicProfilePage />} />
              <Route path="academic/my-faculty-timetable" element={<MyFacultyTimetablePage />} />
              <Route path="academic/teaching-subjects" element={<TeachingSubjectsPage />} />
              <Route path="academic/syllabus-management" element={<SyllabusManagementPage />} />
              <Route path="academic/attendance/mark" element={<MarkAttendancePage />} />
              <Route path="academic/internal-marks" element={<InternalMarksManagementPage />} />
              <Route path="academic/results" element={<ResultProcessingPage />} />
            </Route>

            {/* ================================== */}
            {/* LEAVE & HEALTH (STAFF / FACULTY)   */}
            {/* ================================== */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin', 'hod', 'faculty', 'academic_admin']} />}>
              <Route path="staff/leave/requests" element={<LeaveRequestsPage />} />
              <Route path="staff/health/incidents" element={<HealthIncidentPage />} />
              <Route path="staff/leave/analytics" element={<LeaveAnalyticsPage />} />
            </Route>

            {/* ================================== */}
            {/* ADMIN & SUPER_ADMIN ROUTES         */}
            {/* ================================== */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin']} />}>
              <Route path="admin/events/facilities" element={<AdminFacilityMasterPage />} />
              {/* Additional routes will be placed here */}
            </Route>

            {/* ================================== */}
            {/* EVENT APPROVAL & FACILITY BOOKING  */}
            {/* ================================== */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'sport_teacher']} />}>
              <Route path="sport-teacher/events/dashboard" element={<SportsTeacherApprovalDashboardPage />} />
              <Route path="sport-teacher/events/pending" element={<SportsTeacherApprovalDashboardPage initialStatus="pending" />} />
              <Route path="sport-teacher/events/approved" element={<SportsTeacherApprovalDashboardPage initialStatus="approved" />} />
              <Route path="sport-teacher/events/schedule" element={<SportTeacherFacilitySchedulePage />} />
              <Route path="sport-teacher/events/conflicts" element={<SportTeacherConflictManagementPage />} />
            </Route>

            {/* ================================== */}
            {/* STUDENT ROUTES                     */}
            {/* ================================== */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="student/admission/form" element={<AdmissionFormPage />} />
              <Route path="student/admission/status" element={<AdmissionStatusTrackerPage />} />
              <Route path="student/admission/documents" element={<MyDocumentsPage />} />
              <Route path="student/notifications" element={<StaffNotificationsPage />} /> {/* Shared component for now */}
              <Route path="student/profile" element={<ProfilePage />} />
              {/* MODULE 2: STUDENT UNIFIED DASHBOARD */}
              <Route path="student/master-profile" element={<MyMasterProfilePage />} />
              {/* MODULE 3: STUDENT FEE TRACKING */}
              <Route path="student/fees" element={<StudentFeeOverviewPage />} />
              <Route path="student/fees/receipts" element={<StudentFeeReceiptHistoryPage />} />
              <Route path="student/fees/receipts/:receiptId" element={<DigitalReceiptPage />} />
              <Route path="student/academic-profile" element={<StudentAcademicProfilePage />} />
              <Route path="student/my-timetable" element={<MyStudentTimetablePage />} />
              <Route path="student/my-attendance" element={<StudentAttendancePage />} />
              <Route path="student/my-marks" element={<MyInternalMarksPage />} />
              <Route path="student/my-results" element={<MyResultsPage />} />
              <Route path="student/bonafide" element={<StudentBonafidePage />} />

              {/* MODULE 4: STUDENT HOSTEL ROUTES */}
              <Route path="student/hostel" element={<MyHostelStatusPage />} />
              <Route path="student/hostel/apply" element={<HostelApplicationPage />} />
              <Route path="student/hostel/room" element={<MyRoomDetailsPage />} />
              <Route path="student/hostel/complaints" element={<HostelComplaintsPage />} />
              <Route path="student/hostel/maintenance" element={<MaintenanceRequestsPage />} />
              <Route path="student/hostel/emergency" element={<EmergencyContactPage />} />
              {/* MODULE: LIBRARY STUDENT ROUTES */}
              <Route path="student/library/catalog" element={<StudentBookCatalog />} />
              <Route path="student/library/my-books" element={<MyIssuedBooks />} />
              <Route path="student/library/history" element={<LibraryHistory />} />
              <Route path="student/library/issue-requests" element={<MyIssueRequests />} />

              {/* Phase 2 Library Student */}
              <Route path="student/library/fines" element={<FinePage />} />
              <Route path="student/library/reservations" element={<StudentReservationsPage />} />
              <Route path="student/library/notifications" element={<LibraryNotificationsView />} />
              <Route path="student/library/requests" element={<StudentBookRequestPage />} />
              <Route path="student/library/book/:bookId" element={<BookDetails />} />

              {/* MODULE: COMPLAINT STUDENT ROUTES */}
              <Route path="student/complaints/raise" element={<RaiseComplaintPage />} />
              <Route path="student/complaints/my" element={<MyComplaintsPage />} />
              <Route path="student/complaints/status" element={<ComplaintStatusPage />} />
              <Route path="student/complaints/status/:id" element={<ComplaintStatusTrackingPage />} />
              <Route path="student/complaints/details/:id" element={<ComplaintDetailPage />} />

              {/* MODULE: LEAVE & HEALTH */}
              <Route path="student/leave/apply" element={<StudentLeaveApplyPage />} />
              <Route path="student/leave/history" element={<StudentLeaveHistoryPage />} />

              {/* MODULE: EVENTS & FACILITIES */}
              <Route path="student/events/home" element={<StudentFacilityHomePage />} />
              <Route path="student/events/facilities/:slug" element={<StudentFacilityDetailPage />} />
              <Route path="student/events/requests" element={<StudentMyFacilityRequestsPage />} />
              <Route path="student/events/approved" element={<StudentApprovedBookingsPage />} />
              <Route path="student/events/history" element={<StudentBookingHistoryPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      {/* <Chatbot /> */}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
