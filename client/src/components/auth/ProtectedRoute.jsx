import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  // Assuming token and user data are stored in localStorage for now
  // Real implementation would use Context API / Redux
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check deep route role-based access
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to a default dashboard if role is invalid, or login
      if (['academic_admin', 'hod', 'faculty'].includes(user.role)) {
        return <Navigate to="/app/academic/dashboard" replace />;
      }
      return <Navigate to="/app" replace />;
    }

    // Role authorized, render children or nested routes
    return children ? children : <Outlet />;
  } catch (error) {
    // Corrupted local storage handling
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
