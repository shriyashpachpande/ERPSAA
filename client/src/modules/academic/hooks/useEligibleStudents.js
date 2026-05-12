import { useState, useCallback } from 'react';
import * as enrollmentsApi from '../services/studentSemesterEnrollmentsApi';

export const useEligibleStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEligibleStudents = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await enrollmentsApi.getEligibleStudents(filters);
      setStudents(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch eligible students');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    students,
    loading,
    error,
    fetchEligibleStudents
  };
};
