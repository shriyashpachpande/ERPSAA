import { useState, useEffect } from 'react';

/**
 * Basic useAuth hook to manage user state from localStorage
 * Consistent with ProtectedRoute.jsx implementation
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Silently refresh user data from backend to ensure security metadata is up to date
        const refreshUser = async () => {
          try {
            const response = await fetch('/api/auth/me', {
              headers: { 'Authorization': `Bearer ${storedToken}` }
            });
            const result = await response.json();
            if (result.success) {
              const updatedUser = result.data;
              localStorage.setItem('user', JSON.stringify(updatedUser));
              setUser(updatedUser);
            }
          } catch (err) {
            console.error('Failed to sync auth state', err);
          }
        };
        refreshUser();
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    logout
  };
};
