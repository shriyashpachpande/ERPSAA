import { useState, useEffect, useCallback } from 'react';
import * as allocationsApi from '../services/facultyAcademicAllocationsApi';

export const useFacultyAcademicAllocations = (filters = {}) => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filtersStr = JSON.stringify(filters);

  const fetchAllocations = useCallback(async (params) => {
    const fetchParams = params || JSON.parse(filtersStr);
    setLoading(true);
    try {
      const response = await allocationsApi.getAllocations(fetchParams);
      setAllocations(response.data?.data || response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch allocations');
    } finally {
      setLoading(false);
    }
  }, [filtersStr]);

  const addAllocation = async (data) => {
    try {
      const response = await allocationsApi.createAllocation(data);
      await fetchAllocations();
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create allocation');
    }
  };

  const updateAllocation = async (id, data) => {
    try {
      await allocationsApi.updateAllocation(id, data);
      await fetchAllocations();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update allocation');
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      await allocationsApi.updateAllocationStatus(id, status);
      await fetchAllocations();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update status');
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  return {
    allocations,
    loading,
    error,
    fetchAllocations,
    addAllocation,
    updateAllocation,
    toggleStatus
  };
};
