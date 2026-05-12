import { useState, useEffect, useCallback } from 'react';
import * as timetableApi from '../services/timetableManagementApi';

export const useFacultyTimetable = (facultyId) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimetable = useCallback(async () => {
    if (!facultyId) return;
    setLoading(true);
    try {
      const response = await timetableApi.getFacultyTimetable(facultyId);
      setEntries(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch faculty timetable');
    } finally {
      setLoading(false);
    }
  }, [facultyId]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  return { entries, loading, error, refresh: fetchTimetable };
};
