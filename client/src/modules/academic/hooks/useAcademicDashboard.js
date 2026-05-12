import { useState, useEffect, useCallback } from 'react';
import * as dashboardApi from '../services/academicDashboardApi';

export const useAcademicDashboard = () => {
  const [stats, setStats] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, actionsRes] = await Promise.all([
        dashboardApi.getDashboardStats(),
        dashboardApi.getQuickActions()
      ]);
      setStats(statsRes.data.data);
      setActions(actionsRes.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { stats, actions, loading, error, refresh: fetchDashboard };
};
