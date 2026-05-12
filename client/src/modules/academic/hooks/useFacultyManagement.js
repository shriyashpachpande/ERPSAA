import { useState, useEffect, useCallback } from 'react';
import * as facultyApi from '../services/facultyManagementApi';

export const useFacultyManagement = (initialFilters = null) => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFaculty = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await facultyApi.getFacultyList(filters);
      setFaculty(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch faculty');
    } finally {
      setLoading(false);
    }
  }, []);

  const addFaculty = async (data) => {
    setLoading(true);
    try {
      const response = await facultyApi.createFaculty(data);
      await fetchFaculty();
      return response.data; // Includes tempPassword
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create faculty');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await facultyApi.toggleFacultyStatus(id, status);
      await fetchFaculty();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const deleteFaculty = async (id) => {
    try {
      const response = await facultyApi.deleteFaculty(id);
      await fetchFaculty();
      return response; // { success, message, hardDeleted, data }
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to delete faculty');
    }
  };

  useEffect(() => {
    fetchFaculty(initialFilters || {});
  }, [fetchFaculty, JSON.stringify(initialFilters)]);

  return {
    faculty,
    loading,
    error,
    fetchFaculty,
    addFaculty,
    updateStatus,
    deleteFaculty
  };
};
