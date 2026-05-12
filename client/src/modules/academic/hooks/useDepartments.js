import { useState, useCallback, useEffect } from 'react';
import { departmentsApi } from '../services/departmentsApi';

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentsApi.getAllDepartments();
      setDepartments(data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch departments');
      console.error('Fetch departments error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    loading,
    error,
    fetchDepartments
  };
};
