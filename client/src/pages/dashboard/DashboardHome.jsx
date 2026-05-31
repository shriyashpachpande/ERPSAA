import { Users, GraduationCap, DollarSign, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import StudentDashboard from '../../modules/student-master/pages/StudentDashboardMain';
import AdmissionStaffDashboard from '../../modules/admission-management/pages/staff/AdmissionStaffDashboard';
import AccountsDashboard from '../../modules/fees-management/pages/staff/AccountsDashboard';

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

const DashboardHome = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // 1. Loading State
  if (!user && userStr) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
              <p className="text-gray-500 font-medium">Loading dashboard...</p>
          </div>
      );
  }

  // 2. Role-based routing
  if (user?.role === 'student') {
      return <StudentDashboard />;
  }

  if (user?.role === 'admission_staff') {
      return <AdmissionStaffDashboard />;
  }

  if (user?.role === 'staff_account' || user?.role === 'accounts_staff') {
    return <AccountsDashboard />;
  }

  if (user?.role === 'hostel_staff') {
    return <Navigate to="/app/hostel/dashboard" replace />;
  }

  if (user?.role === 'library_staff') {
    return <Navigate to="/app/library/dashboard" replace />;
  }

  if (user?.role === 'academic_admin' || user?.role === 'hod' || user?.role === 'faculty') {
    return <Navigate to="/app/academic/dashboard" replace />;
  }

  if (user?.role === 'sport_teacher') {
    return <Navigate to="/app/sport-teacher/events/dashboard" replace />;
  }

  // 3. Fallback for unauthenticated or missing role
  if (!user || !user.role) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Expired</h2>
              <p className="text-gray-500 mb-6 max-w-md">We couldn't verify your session or role. Please try logging in again.</p>
              <button type="button" 
                  onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                  className="px-6 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-black transition-colors"
                >
                  Return to Login
              </button>
          </div>
      );
  }

  // 4. Staff / Admin Dashboard (Default for other roles)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back, {user.fullName}. Here's what's happening today.</p>
        </div>
        <button type="button" className="bg-brand-dark text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-black transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="4,821" icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="New Admissions" value="342" icon={GraduationCap} color="text-green-600" bg="bg-green-50" />
        <StatCard title="Fee Collection" value="₹24.5M" icon={DollarSign} color="text-purple-600" bg="bg-purple-50" />
        <StatCard title="Library Books" value="12,045" icon={BookOpen} color="text-orange-600" bg="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admissions Trend</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
            <p className="text-gray-400 font-medium">Chart visualization area</p>
          </div>
        </div>

        {/* Notifications / Side Area */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 mr-3 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New admission application received</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
