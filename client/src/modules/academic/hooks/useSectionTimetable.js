import { useState, useEffect, useCallback } from 'react';
import * as timetableApi from '../services/timetableManagementApi';

export const useSectionTimetable = (sectionId) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimetable = useCallback(async () => {
    if (!sectionId) return;
    setLoading(true);
    try {
      const response = await timetableApi.getSectionTimetable(sectionId);
      setEntries(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch section timetable');
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  return { entries, loading, error, refresh: fetchTimetable };
};
