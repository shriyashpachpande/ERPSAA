import { useState, useEffect, useCallback } from 'react';
import * as subjectsApi from '../services/subjectsApi';

export const useSubjects = (initialFilters = null) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubjects = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await subjectsApi.getSubjects(filters);
      setSubjects(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubject = async (data) => {
    try {
      const response = await subjectsApi.createSubject(data);
      await fetchSubjects();
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create subject');
    }
  };

  const updateSubject = async (id, data) => {
    try {
      await subjectsApi.updateSubject(id, data);
      await fetchSubjects();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update subject');
    }
  };

  useEffect(() => {
    fetchSubjects(initialFilters || {});
  }, [fetchSubjects, JSON.stringify(initialFilters)]);

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    addSubject,
    updateSubject
  };
};
