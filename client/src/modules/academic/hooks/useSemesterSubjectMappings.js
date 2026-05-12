import { useState, useEffect, useCallback } from 'react';
import * as mappingsApi from '../services/semesterSubjectMappingsApi';

export const useSemesterSubjectMappings = (academicYearId, department, semesterId) => {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMappings = useCallback(async () => {
    if (!academicYearId || !department || !semesterId) {
      setMappings([]);
      return;
    }
    setLoading(true);
    try {
      const response = await mappingsApi.getMappings({ academicYearId, department, semesterId });
      // The API returns { success: true, count: X, data: [...] }
      setMappings(response.data || response); // mappingsApi.getMappings already returns response.data
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch mappings');
    } finally {
      setLoading(false);
    }
  }, [academicYearId, JSON.stringify(department), semesterId]);

  const addMapping = async (data) => {
    try {
      await mappingsApi.createMapping(data);
      await fetchMappings();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create mapping');
    }
  };

  const addBulkMappings = async (academicYearId, department, semesterId, subjectIds) => {
    try {
      await mappingsApi.bulkCreateMappings({ academicYearId, department, semesterId, subjectIds });
      await fetchMappings();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create bulk mappings');
    }
  };

  const removeMapping = async (id) => {
    try {
      await mappingsApi.deleteMapping(id);
      await fetchMappings();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to remove mapping');
    }
  };

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  return {
    mappings,
    loading,
    error,
    fetchMappings,
    addMapping,
    addBulkMappings,
    removeMapping
  };
};
