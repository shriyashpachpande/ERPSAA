import { useState, useEffect, useCallback } from 'react';
import * as yearsApi from '../services/academicYearsApi';

export const useAcademicYears = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchYears = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await yearsApi.getYears(params);
      setYears(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch academic years');
    } finally {
      setLoading(false);
    }
  }, []);

  const addYear = async (data) => {
    try {
      const response = await yearsApi.createYear(data);
      await fetchYears();
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create year');
    }
  };

  const updateYear = async (id, data) => {
    try {
      await yearsApi.updateYear(id, data);
      await fetchYears();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update year');
    }
  };

  const markCurrent = async (id) => {
    try {
      await yearsApi.setCurrentYear(id);
      await fetchYears();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to set current year');
    }
  };

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  return {
    years,
    currentYear: years.find(y => y.isCurrent),
    loading,
    error,
    fetchYears,
    addYear,
    updateYear,
    markCurrent
  };
};
