import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Users, FileText, Settings, CreditCard, Book, Bell,
  Clock, Folder, LogOut, UserPlus, X, Receipt, ChevronDown, CheckCircle,
  ChevronRight, Laptop, Activity, ShieldAlert, Wrench, Phone,
  ClipboardList, Bed, AlertTriangle, History, ArrowUpRight, ArrowDownLeft,
  Calendar, MessageSquare, LayoutDashboard, Inbox, BookOpen, CheckCircle2
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';
import SidebarConstellationBackground from './SidebarConstellationBackground';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [expandedItem, setExpandedItem] = useState(null); // For Mobile
  const [hoveredItem, setHoveredItem] = useState(null);   // For Desktop Flyout
  const [flyoutTop, setFlyoutTop] = useState(0);
  const flyoutRef = useRef(null);
  const scrollRef = useRef(null);
  const closeTimeout = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const clearCloseTimeout = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const startCloseTimeout = () => {
    clearCloseTimeout();
    closeTimeout.current = setTimeout(() => {
      setHoveredItem(null);
    }, 150); // 150ms delay
  };

  // Safely parse user from local storage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { role: 'student', fullName: 'Guest', email: '' };

  const role = user.role;

  // Role Aliases / Mapping
  const isLibrarian = ['librarian', 'library_staff'].includes(role);
  const isAccounts = ['accounts_staff', 'staff_account'].includes(role);
  const isHostelStaff = ['hostel_warden', 'hostel_staff'].includes(role);
  const isAdmissionStaff = role === 'admission_staff';
  const isAdmin = ['super_admin', 'admin'].includes(role);
  const isAcademicAdmin = role === 'academic_admin';
  const isHOD = role === 'hod';
  const isFaculty = role === 'faculty';
  const isStudent = role === 'student';
  const isSportTeacher = role === 'sport_teacher';

  // Student Menu
  const studentMenu = [
    { name: 'Dashboard', path: '/app', icon: Home },
    { name: 'Admission Form', path: '/app/student/admission/form', icon: FileText },
    { name: 'Application Status', path: '/app/student/admission/status', icon: Clock },
    { name: 'My Documents', path: '/app/student/admission/documents', icon: Folder },
    {
      name: 'Academics',
      icon: Book,
      children: [
        { name: 'Academic Profile', path: '/app/student/academic-profile', icon: Users },
        { name: 'My Timetable', path: '/app/student/my-timetable', icon: Clock },
        { name: 'My Attendance', path: '/app/student/my-attendance', icon: ClipboardList },
        { name: 'Internal Marks', path: '/app/student/my-marks', icon: FileText },
        { name: 'Semester Results', path: '/app/student/my-results', icon: Receipt },
        { name: 'Bonafide Certificate', path: '/app/student/bonafide', icon: FileText },
      ]
    },
    { name: 'Master Profile', path: '/app/student/master-profile', icon: Users },
    { name: 'Notifications', path: '/app/student/notifications', icon: Bell },
    { name: 'Fees', path: '/app/student/fees', icon: CreditCard },
    { name: 'Receipts', path: '/app/student/fees/receipts', icon: Receipt },
    {
      name: 'Hostel',
      icon: Home,
      children: [
        { name: 'Hostel Application', path: '/app/student/hostel/apply', icon: ClipboardList },
        { name: 'My Hostel Status', path: '/app/student/hostel', icon: Activity },
        { name: 'My Room Details', path: '/app/student/hostel/room', icon: Bed },
        { name: 'Hostel Complaints', path: '/app/student/hostel/complaints', icon: AlertTriangle },
        { name: 'Maintenance Requests', path: '/app/student/hostel/maintenance', icon: Wrench },
        { name: 'Emergency Contact', path: '/app/student/hostel/emergency', icon: Phone },
        { name: 'Hostel History', path: '/app/student/hostel/history', icon: History },
      ]
    },
    {
      name: 'Library',
      icon: Book,
      children: [
        { name: 'Book Catalog', path: '/app/student/library/catalog', icon: Book },
        { name: 'My Issued Books', path: '/app/student/library/my-books', icon: Clock },
        { name: 'Borrow Requests', path: '/app/student/library/issue-requests', icon: FileText },
        { name: 'Library History', path: '/app/student/library/history', icon: History },
        { name: 'Library Fines', path: '/app/student/library/fines', icon: CreditCard },
        { name: 'Reservations', path: '/app/student/library/reservations', icon: Clock },
        { name: 'Suggestions', path: '/app/student/library/requests', icon: UserPlus },
        { name: 'Library Alerts', path: '/app/student/library/notifications', icon: Bell },
      ]
    },
    {
      name: 'Complaints',
      icon: MessageSquare,
      children: [
        { name: 'Raise Complaint', path: '/app/student/complaints/raise', icon: UserPlus },
        { name: 'My Complaints', path: '/app/student/complaints/my', icon: ClipboardList },
        { name: 'Complaint Status', path: '/app/student/complaints/status', icon: Activity },
      ]
    },
    {
      name: 'Events & Facilities',
      icon: Calendar,
      children: [
        { name: 'Browse Facilities', path: '/app/student/events/home', icon: LayoutDashboard },
        { name: 'My Facility Requests', path: '/app/student/events/requests', icon: Clock },
        { name: 'My Approved Bookings', path: '/app/student/events/approved', icon: CheckCircle },
        { name: 'Booking History', path: '/app/student/events/history', icon: History },
      ]
    },
    {
      name: 'Leave Management',
      icon: Activity,
      children: [
        { name: 'Apply Leave', path: '/app/student/leave/apply', icon: FileText },
        { name: 'My Leaves', path: '/app/student/leave/history', icon: History },
      ]
    },
    { name: 'Settings', path: '/app/student/profile', icon: Settings },
  ];

  // Staff / Admin Menu
  const staffMenu = [
    { name: 'Dashboard', path: '/app', icon: Home },
    { name: 'New Admission', path: '/app/staff/new-admission', icon: UserPlus },
    { name: 'Admissions', path: '/app/staff/admissions', icon: Users },
    { name: 'Review Queue', path: '/app/staff/review-queue', icon: Book },
    { name: 'Student Master', path: '/app/staff/student-directory', icon: Users },
    { name: 'Bonafide Requests', path: '/app/staff/bonafide', icon: FileText },
    { name: 'Fee Dashboard', path: '/app/staff/fees/dashboard', icon: CreditCard },
    { name: 'Fee Structures', path: '/app/staff/fees/structures', icon: Book },
    { name: 'Student Fees', path: '/app/staff/fees/directory', icon: Users },
  ];

  const getComplaintMenu = () => {
    const base = { name: 'Complaints', icon: MessageSquare, children: [] };

    if (isAdmin) {
      base.children = [
        { name: 'All Complaints', path: '/app/staff/complaints/all', icon: LayoutDashboard },
        { name: 'Assigned Complaints', path: '/app/staff/complaints/assigned', icon: Inbox },
        { name: 'Escalated Complaints', path: '/app/staff/complaints/escalated', icon: AlertTriangle },
        { name: 'Complaint Analytics', path: '/app/staff/complaints/dashboard', icon: Activity },
        { name: 'Complaint Settings', path: '/app/staff/complaints/settings', icon: Settings },
      ];
    } else if (isHOD) {
      base.children = [
        { name: 'Assigned Complaints', path: '/app/staff/complaints/assigned', icon: Inbox },
        { name: 'Department Complaints', path: '/app/staff/complaints/department', icon: Users },
        { name: 'Escalated Complaints', path: '/app/staff/complaints/escalated', icon: AlertTriangle },
        { name: 'Complaint Analytics', path: '/app/staff/complaints/dashboard', icon: Activity },
        { name: 'Resolved Complaints', path: '/app/staff/complaints/resolved', icon: CheckCircle }
      ];
    } else if (isFaculty) {
      base.children = [
        { name: 'Assigned Complaints', path: '/app/staff/complaints/assigned', icon: Inbox },
        { name: 'Department Complaints', path: '/app/staff/complaints/department', icon: Users },
        { name: 'Resolved Complaints', path: '/app/staff/complaints/resolved', icon: CheckCircle }
      ];
    } else if (isLibrarian) {
      base.children = [
        { name: 'Assigned Complaints', path: '/app/staff/complaints/assigned', icon: Inbox },
        { name: 'Library Complaints', path: '/app/staff/complaints/department', icon: Users },
        { name: 'Resolved Complaints', path: '/app/staff/complaints/resolved', icon: CheckCircle }
      ];
    } else if (isAccounts) {
      base.children = [
        { name: 'Assigned Complaints', path: '/app/staff/complaints/assigned', icon: Inbox },
        { name: 'Account Complaints', path: '/app/staff/complaints/department', icon: Users },
        { name: 'Resolved Complaints', path: '/app/staff/complaints/resolved', icon: CheckCircle }
      ];
    } else if (isAdmissionStaff) {
      base.children = [
        { name: 'Assigned Complaints', path: '/app/staff/complaints/assigned', icon: Inbox },
        { name: 'Admission Complaints', path: '/app/staff/complaints/department', icon: Users },
        { name: 'Resolved Complaints', path: '/app/staff/complaints/resolved', icon: CheckCircle }
      ];
    } else if (isHostelStaff) {
      base.children = [
        { name: 'Assigned Complaints', path: '/app/staff/complaints/assigned', icon: Inbox },
        { name: 'Hostel Complaints', path: '/app/staff/complaints/department', icon: Users },
        { name: 'Resolved Complaints', path: '/app/staff/complaints/resolved', icon: CheckCircle }
      ];
    } else if (isStudent) {
      base.children = [
        { name: 'Raise Complaint', path: '/app/student/complaints/raise', icon: UserPlus },
        { name: 'My Complaints', path: '/app/student/complaints/my', icon: ClipboardList },
        { name: 'Complaint Status', path: '/app/student/complaints/status', icon: Activity },
      ];
    } else {
      base.children = [
        { name: 'Assigned Complaints', path: '/app/staff/complaints/assigned', icon: Inbox },
        { name: 'Department Complaints', path: '/app/staff/complaints/department', icon: Users },
        { name: 'Resolved Complaints', path: '/app/staff/complaints/resolved', icon: CheckCircle }
      ];
    }
    return base;
  };

  const getLeaveMenu = () => {
    const base = {
      name: 'Leave & Health',
      icon: Activity,
      children: [
        { name: 'Leave Requests', path: '/app/staff/leave/requests', icon: Inbox },
        { name: 'Health Incidents', path: '/app/staff/health/incidents', icon: AlertTriangle }
      ]
    };
    if (isAdmin || isHOD || isAcademicAdmin) {
      base.children.push({ name: 'Leave Analytics', path: '/app/staff/leave/analytics', icon: LayoutDashboard });
    }
    return base;
  };

  // Additional Super Admin Items (Nested)
  if (role === 'super_admin') {
    staffMenu.push({
      name: 'Hostel',
      icon: Home,
      children: [
        { name: 'Hostel Dashboard', path: '/app/hostel/dashboard', icon: Home },
        { name: 'Hostel Applicants', path: '/app/hostel/applicants', icon: Users },
        { name: 'Room Allocation', path: '/app/hostel/allocation', icon: Bed },
        { name: 'Room Details', path: '/app/hostel/rooms', icon: Laptop },
        { name: 'Occupancy Analytics', path: '/app/hostel/occupancy', icon: Activity },
        { name: 'Check-in / Check-out', path: '/app/hostel/check-in-out', icon: Clock },
        { name: 'Hostel Complaints', path: '/app/hostel/complaints', icon: AlertTriangle },
        { name: 'Maintenance Requests', path: '/app/hostel/maintenance', icon: Wrench },
        { name: 'Emergency Contacts', path: '/app/hostel/emergency', icon: Phone },
      ]
    });
    staffMenu.push({
      name: 'Library',
      icon: Book,
      children: [
        { name: 'Library Overview', path: '/app/admin/library/overview', icon: Activity },
        { name: 'Book Catalog', path: '/app/admin/library/catalog', icon: Book },
        { name: 'Library Policies', path: '/app/admin/library/policies', icon: Settings },
        { name: 'Book Suggestions', path: '/app/admin/library/book-requests', icon: FileText },
        { name: 'Library Analytics', path: '/app/admin/library/analytics', icon: Activity },
        { name: 'Security Audit', path: '/app/admin/library/audit-logs', icon: ShieldAlert },
      ]
    });
  }
  if (isAdmin) {
    // ... items ...
    staffMenu.push({ name: 'Reports', path: '/app/staff/reports', icon: FileText });
    staffMenu.push(getComplaintMenu());
    staffMenu.push(getLeaveMenu());
    staffMenu.push({
      name: 'Events & Facilities',
      icon: Calendar,
      children: [
        { name: 'Facility Master', path: '/app/admin/events/facilities', icon: LayoutDashboard },
        { name: 'Category Master', path: '/app/admin/events/categories', icon: LayoutDashboard },
        { name: 'Slot Rules', path: '/app/admin/events/rules', icon: Settings },
        { name: 'All Bookings', path: '/app/admin/events/bookings', icon: ClipboardList },
        { name: 'Reports', path: '/app/admin/events/reports', icon: FileText }
      ]
    });
    staffMenu.push({ name: 'Notifications', path: '/app/staff/notifications', icon: Bell });
    staffMenu.push({ name: 'Profile', path: '/app/staff/profile', icon: Settings });
  } else {
    // Other staff items
    staffMenu.push({ name: 'Reports', path: '/app/staff/reports', icon: FileText });
    staffMenu.push(getComplaintMenu());
    staffMenu.push(getLeaveMenu());
    staffMenu.push({ name: 'Notifications', path: '/app/staff/notifications', icon: Bell });
    staffMenu.push({ name: 'Profile', path: '/app/staff/profile', icon: Settings });
  }

  // Hostel Staff Menu
  const hostelStaffMenu = [
    { name: 'Hostel Dashboard', path: '/app/hostel/dashboard', icon: Home },
    { name: 'Applicants', path: '/app/hostel/applicants', icon: Users },
    { name: 'Room Allocation', path: '/app/hostel/allocation', icon: Bed },
    { name: 'Occupancy Analytics', path: '/app/hostel/occupancy', icon: Activity },
    { name: 'Check-in/Out', path: '/app/hostel/check-in-out', icon: Clock },
    getComplaintMenu(),
    { name: 'Maintenance', path: '/app/hostel/maintenance', icon: Wrench },
    { name: 'Profile', path: '/app/staff/profile', icon: Settings },
  ];

  const libraryStaffMenu = [
    { name: 'Library Dashboard', path: '/app/library/dashboard', icon: Home },
    { name: 'Book Catalog', path: '/app/library/catalog', icon: Book },
    { name: 'Issue Book', path: '/app/library/issue', icon: ArrowUpRight },
    { name: 'Return Book', path: '/app/library/return', icon: ArrowDownLeft },
    { name: 'Issue Requests', path: '/app/library/issue-requests', icon: FileText },
    { name: 'Issued Books', path: '/app/library/issued-list', icon: Clock },
    { name: 'Fine Management', path: '/app/library/fine-management', icon: CreditCard },
    { name: 'Waitlist Management', path: '/app/library/reservation-management', icon: History },
    { name: 'Inventory Incidents', path: '/app/library/lost-damaged', icon: AlertTriangle },
    getComplaintMenu(),
    { name: 'Profile', path: '/app/staff/profile', icon: Settings },
  ];

  const sportTeacherMenu = [
    { name: 'Approval Dashboard', path: '/app/sport-teacher/events/dashboard', icon: ClipboardList },
    { name: 'Pending Facility Requests', path: '/app/sport-teacher/events/pending', icon: Clock },
    { name: 'Approved Bookings', path: '/app/sport-teacher/events/approved', icon: CheckCircle },
    { name: 'Facility Schedule', path: '/app/sport-teacher/events/schedule', icon: Calendar },
    { name: 'Conflict Management', path: '/app/sport-teacher/events/conflicts', icon: AlertTriangle },
    getComplaintMenu(),
    { name: 'Profile', path: '/app/staff/profile', icon: Settings },
  ];

  // Academic Management Menu
  const academicMenu = [
    { name: 'Academic Dashboard', path: '/app/academic/dashboard', icon: Home },
    { name: 'Academic Years', path: '/app/academic/years', icon: ClipboardList },
    { name: 'Semesters', path: '/app/academic/semesters', icon: Clock },
    { name: 'Subjects', path: '/app/academic/subjects', icon: Book },
    { name: 'Faculty Management', path: '/app/academic/faculty', icon: Users },
    { name: 'Sections', path: '/app/academic/sections', icon: Folder },
    { name: 'Subject Mapping', path: '/app/academic/subject-mapping', icon: Receipt },
    { name: 'Enrollments', path: '/app/academic/enrollments', icon: UserPlus },
    { name: 'Faculty Allocation', path: '/app/academic/faculty-allocations', icon: ShieldAlert },
    { name: 'Timetable Builder', path: '/app/academic/timetable', icon: Clock },
    { name: 'Internal Marks', path: '/app/academic/internal-marks', icon: FileText },
    { name: 'Result Processing', path: '/app/academic/results', icon: Receipt },
    { name: 'My Timetable', path: '/app/academic/my-faculty-timetable', icon: Calendar },
    { name: 'Teaching Subjects', path: '/app/academic/teaching-subjects', icon: BookOpen },
    { name: 'Syllabus Manage', path: '/app/academic/syllabus-management', icon: CheckCircle2 },
    { name: 'Mark Attendance', path: '/app/academic/attendance/mark', icon: ClipboardList },
    { name: 'My Mentees', path: '/app/academic/my-mentees', icon: Users },
  ];

  let menuItems;
  if (role === 'academic_admin') {
    const studentMasterItem = staffMenu.find(m => m.name === 'Student Master') || { name: 'Student Master', path: '/app/staff/student-directory', icon: Users };
    const reportsItem = staffMenu.find(m => m.name === 'Reports') || { name: 'Reports', path: '/app/staff/reports', icon: FileText };
    const allowedNamesInOrder = [
      'Academic Dashboard',
      'Academic Years',
      'Enrollments',
      'Faculty Allocation',
      'Faculty Management',
      'Internal Marks',
      'Mark Attendance',
      'Reports',
      'Result Processing',
      'Sections',
      'Semesters',
      'Student Master',
      'Subject Mapping',
      'Subjects',
      'Timetable Builder'
    ];

    const combinedSource = [
      studentMasterItem,
      reportsItem,
      ...academicMenu
    ];

    menuItems = [
      ...allowedNamesInOrder.map(name => combinedSource.find(m => m.name === name)).filter(Boolean),
      getComplaintMenu(),
      getLeaveMenu()
    ];
  } else if (role === 'hod') {
    const hodMenuNames = [
      'Academic Dashboard', 'My Mentees', 'Student Details', 'Faculty Details', 'Subjects', 'Teaching Subjects', 'Syllabus Manage', 'Sections', 'My Timetable', 'Mark Attendance', 'Internal Marks', 'Result Processing'
    ];

    menuItems = hodMenuNames.map(name => {
      // Find item in source academicMenu
      let item = academicMenu.find(m => m.name === name);

      // Fallback for Student Details since it was removed from academicMenu
      if (!item && name === 'Student Details') {
        item = { name: 'Student Details', path: '/app/academic/enrollments', icon: Users };
      }

      // Fallback for Faculty Details
      if (!item && name === 'Faculty Details') {
        item = { name: 'Faculty Details', path: '/app/academic/hod/faculty', icon: Users };
      }

      if (!item) return null;

      // Transform names for HOD view consistency
      const transformedItem = { ...item };
      if (transformedItem.name === 'Subjects') transformedItem.name = 'My Subjects';
      if (transformedItem.name === 'Sections') transformedItem.name = 'My Sections';
      if (transformedItem.name === 'Result Processing') transformedItem.name = 'Results';

      return transformedItem;
    }).filter(Boolean);

    // Insert Mentor Allocation for HOD
    const sectionsIdx = menuItems.findIndex(m => m.name === 'My Sections');
    if (sectionsIdx !== -1) {
      menuItems.splice(sectionsIdx + 1, 0, {
        name: 'Mentor Allocation',
        path: '/app/academic/sections?focus=mentor',
        icon: UserPlus
      });
    } else {
      menuItems.push({
        name: 'Mentor Allocation',
        path: '/app/academic/sections?focus=mentor',
        icon: UserPlus
      });
    }

    menuItems.push(getComplaintMenu());
    menuItems.push(getLeaveMenu());
  } else if (role === 'faculty') {
    const dashboardItem = staffMenu.find(m => m.name === 'Dashboard') || { name: 'Dashboard', path: '/app', icon: Home };
    const allowedFacultyNames = [
      'Academic Dashboard', 'My Mentees', 'Subjects', 'Teaching Subjects', 'Syllabus Manage', 'My Timetable', 'Mark Attendance', 'Internal Marks', 'Result Processing'
    ];
    let orderedFacultyItems = allowedFacultyNames.map(
      name => academicMenu.find(m => m.name === name)
    ).filter(Boolean);
    orderedFacultyItems = orderedFacultyItems.map(item => {
      if (item.name === 'Subjects') return { ...item, name: 'My Subjects' };
      if (item.name === 'Result Processing') return { ...item, name: 'Results' };
      return item;
    });

    menuItems = [...orderedFacultyItems, getComplaintMenu(), getLeaveMenu()];
  } else {
    menuItems = (isAdmin)
      ? [...staffMenu, { name: 'Academic Management', icon: Book, children: academicMenu }]
      : (isAccounts || role === 'admission_staff' ? staffMenu : (isHostelStaff ? hostelStaffMenu : (isLibrarian ? libraryStaffMenu : (isSportTeacher ? sportTeacherMenu : studentMenu))));
  }

  // Filter menu items for admission_staff (Block Fees) and staff_account (Limit to Fees/Reports/Profile)
  const filteredMenuItems = menuItems.filter(item => {
    if (role === 'admission_staff') {
      // Block anything related to fees for admission staff
      return !item.path?.includes('/fees/') && !item.name.toLowerCase().includes('fee');
    }
    if (isAccounts || role === 'staff_account') {
      // Accounts Department allowed paths
      const allowedPaths = [
        '/app',
        '/app/staff/fees/dashboard',
        '/app/staff/fees/structures',
        '/app/staff/fees/directory',
        '/app/staff/reports',
        '/app/staff/profile',
        '/app/staff/complaints/dashboard',
        '/app/staff/complaints/assigned',
        '/app/staff/complaints/department',
        '/app/staff/complaints/resolved'
      ];

      // Allow parent menus (with children) or items with explicit paths in the allowlist
      if (item.children) {
        return item.children.some(child => allowedPaths.includes(child.path));
      }
      return allowedPaths.includes(item.path);
    }
    if (role === 'academic_admin' || role === 'hod' || role === 'faculty') {
      return true; // Already precisely constructed lists
    }
    if (role === 'hostel_staff') {
      // Limit to hostel operations
      return true; // Already assigned hostelStaffMenu
    }
    return true;
  });

  useEffect(() => {
    // Subtle stagger on initial mount for desktop
    if (navRef.current) {
      gsap.fromTo(
        navRef.current.children,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [menuItems.length]);

  useEffect(() => {
    if (hoveredItem && flyoutRef.current) {
      gsap.fromTo(flyoutRef.current,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' }
      );
    }
  }, [hoveredItem]);

  useEffect(() => {
    if (!scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.firstElementChild,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
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
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-50 w-64 h-screen bg-brand-dark text-white flex flex-col shadow-2xl shrink-0 transition-transform duration-300 ease-out`}>
        <SidebarConstellationBackground />

        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
            <h1 className="text-xl font-bold tracking-wider text-white uppercase">ERPSAA<span className="text-primary-400"></span></h1>
            <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto py-4 min-h-0 touch-pan-y overscroll-contain custom-scrollbar"
          >
            <nav ref={navRef} className="px-3 space-y-1 relative">
              {filteredMenuItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const hasActiveChild = hasChildren && item.children.some(child => location.pathname === child.path);
                const isActive = (item.path && item.path.includes('?') 
                  ? (location.pathname + location.search) === item.path 
                  : location.pathname === item.path && !location.search) || hasActiveChild;
                const isExpanded = expandedItem === item.name;
                const Icon = item.icon;

                if (hasChildren) {
                  const renderInline = role === 'academic_admin' && item.name === 'Academic Management';

                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={(e) => {
                        if (renderInline) return;
                        clearCloseTimeout();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setFlyoutTop(rect.top);
                        setHoveredItem(item.name);
                      }}
                      onMouseLeave={() => {
                        if (renderInline) return;
                        startCloseTimeout();
                      }}
                    >
                      {/* Top Level Item */}
                      <button
                        onClick={() => {
                          if (!renderInline) {
                            setExpandedItem(isExpanded ? null : item.name);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${isActive || (!renderInline && hoveredItem === item.name)
                          ? 'bg-primary-600/20 text-primary-400'
                          : `text-gray-400 ${!isSportTeacher ? 'hover:bg-white/5 hover:text-white' : ''}`
                          } ${renderInline ? 'cursor-default' : ''}`}
                      >
                        <div className="flex items-center">
                          <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-400' : 'text-gray-400 group-hover:text-white'}`} />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        {!renderInline ? (
                          <>
                            <div className="md:hidden">
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                            <div className="hidden md:block">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </>
                        ) : (
                          <div>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        )}
                      </button>

                      {/* Mobile or Inline Collapsible Submenu */}
                      {(isExpanded || renderInline) && (
                        <div className={`pl-8 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200 ${!renderInline ? 'md:hidden' : ''}`}>
                          {item.children.map(child => (
                            <Link
                              key={child.name}
                              to={child.path}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${location.pathname === child.path ? 'text-primary-400' : 'text-gray-500 hover:text-white'}`}
                            >
                              <child.icon className="w-4 h-4 mr-2" />
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Desktop: Hover Flyout Submenu - REMOVED FROM HERE, MOVED OUTSIDE SCROLL AREA */}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${isActive
                      ? 'bg-primary-600/20 text-primary-400'
                      : `text-gray-400 ${!isSportTeacher ? 'hover:bg-white/5 hover:text-white' : ''}`
                      }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-400' : 'text-gray-400 group-hover:text-white'}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Flyout Submenu Panel (Rendered outside scroll area to avoid clipping) */}
          {hoveredItem && (
            <div
              ref={flyoutRef}
              onMouseEnter={() => {
                clearCloseTimeout();
              }}
              onMouseLeave={startCloseTimeout}
              style={{
                top: `${Math.max(
                  10,
                  Math.min(
                    flyoutTop,
                    window.innerHeight - (flyoutRef.current?.offsetHeight || 400) - 100
                  )
                )}px`,
                maxHeight: 'calc(100vh - 120px)'
              }}
              className="hidden md:block fixed left-64 ml-2 w-72 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 z-[1000] animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col"
            >
              <div className="py-4 px-5 border-b border-white/5 mb-4 bg-gradient-to-r from-primary-600/20 to-transparent rounded-2xl shrink-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 opacity-80">{hoveredItem} Management</p>
                <h4 className="text-white font-black text-lg tracking-tight mt-1 leading-tight">Operations</h4>
              </div>

              <div className="space-y-1.5 overflow-y-auto custom-scrollbar-hide flex-1 pr-1">
                {filteredMenuItems.find(m => m.name === hoveredItem)?.children?.map(child => (
                  <Link
                    key={child.name}
                    to={child.path}
                    onClick={() => {
                      setHoveredItem(null);
                      setIsOpen(false);
                    }}
                    className={`flex items-center px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 group ${location.pathname === child.path
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                      : `text-gray-400 ${!isSportTeacher ? 'hover:bg-white/10 hover:text-white hover:translate-x-1' : ''}`}`}
                  >
                    <child.icon className={`w-4.5 h-4.5 mr-4 transition-colors ${location.pathname === child.path ? 'text-white' : 'text-gray-500 group-hover:text-primary-400'}`} />
                    <span className="tracking-tight">{child.name}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 px-5 flex items-center justify-between shrink-0">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{role.replace('_', ' ')}</p>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-white/10 space-y-3 shrink-0">
            <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold shadow-lg uppercase shrink-0">
                {user.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.fullName || 'User'}</p>
                <p className="text-xs text-gray-400 capitalize truncate">
                  {user.designation ? (user.designation === 'Head of Department' ? 'HOD' : user.designation) : role.replace('_', ' ')}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 rounded-xl text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors text-sm font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
