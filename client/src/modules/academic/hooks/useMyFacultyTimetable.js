import { useState, useEffect, useCallback } from 'react';
import * as timetableApi from '../services/timetableManagementApi';

export const useMyFacultyTimetable = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimetable = useCallback(async () => {
    setLoading(true);
    try {
      const response = await timetableApi.getMyTimetable();
      setEntries(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch personal timetable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  return { entries, loading, error, refresh: fetchTimetable };
};
