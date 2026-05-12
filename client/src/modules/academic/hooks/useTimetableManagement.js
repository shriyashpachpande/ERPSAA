import { useState, useEffect, useCallback } from 'react';
import * as timetableApi from '../services/timetableManagementApi';

export const useTimetableManagement = (filters = {}) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filtersStr = JSON.stringify(filters);

  const fetchEntries = useCallback(async (params) => {
    const fetchParams = params || JSON.parse(filtersStr);
    setLoading(true);
    try {
      const response = await timetableApi.getTimetableEntries(fetchParams);
      setEntries(response.data?.data || response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  }, [filtersStr]);

  const addEntry = async (data) => {
    try {
      const response = await timetableApi.createTimetableEntry(data);
      await fetchEntries();
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to add entry');
    }
  };

  const updateEntry = async (id, data) => {
    try {
      await timetableApi.updateTimetableEntry(id, data);
      await fetchEntries();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update entry');
    }
  };

  const removeEntry = async (id) => {
    try {
      await timetableApi.deleteTimetableEntry(id);
      await fetchEntries();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to delete entry');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    loading,
    error,
    fetchEntries,
    addEntry,
    updateEntry,
    removeEntry
  };
};
