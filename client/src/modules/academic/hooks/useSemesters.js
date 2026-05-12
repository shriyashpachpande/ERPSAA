import { useState, useEffect, useCallback } from 'react';
import * as semestersApi from '../services/semestersApi';

export const useSemesters = (academicYearId) => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSemesters = useCallback(async () => {
    if (!academicYearId) {
      setSemesters([]);
      return;
    }
    setLoading(true);
    try {
      const response = await semestersApi.getSemesters({ academicYearId });
      setSemesters(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch semesters');
    } finally {
      setLoading(false);
    }
  }, [academicYearId]);

  const addSemester = async (data) => {
    try {
      const response = await semestersApi.createSemester(data);
      await fetchSemesters();
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create semester');
    }
  };

  const updateSemester = async (id, data) => {
    try {
      await semestersApi.updateSemester(id, data);
      await fetchSemesters();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update semester');
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, [fetchSemesters]);

  return {
    semesters,
    loading,
    error,
    fetchSemesters,
    addSemester,
    updateSemester
  };
};
