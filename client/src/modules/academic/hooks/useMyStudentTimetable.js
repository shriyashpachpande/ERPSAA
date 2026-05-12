import { useState, useEffect, useCallback } from 'react';
import * as timetableApi from '../services/timetableManagementApi';
import { useStudentAcademicProfile } from './useStudentAcademicProfile';

export const useMyStudentTimetable = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedSection, setLastFetchedSection] = useState(null);
  
  const { profile, loading: profileLoading } = useStudentAcademicProfile();

  const fetchTimetable = useCallback(async (sectionId) => {
    if (!sectionId || sectionId === lastFetchedSection) {
      if (!sectionId) setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await timetableApi.getSectionTimetable(sectionId);
      setEntries(response.data.data || []);
      setLastFetchedSection(sectionId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch student timetable');
    } finally {
      setLoading(false);
    }
  }, [lastFetchedSection]);

  useEffect(() => {
    if (profileLoading) return;
    
    const section = profile?.currentEnrollment?.sectionId;
    const sectionId = section?._id || section;
    
    if (sectionId && sectionId !== lastFetchedSection) {
      fetchTimetable(sectionId);
    } else if (!sectionId) {
      setLoading(false);
    }
  }, [profile, profileLoading, fetchTimetable, lastFetchedSection]);

  return { 
    entries, 
    loading: loading || profileLoading, 
    error, 
    refresh: () => fetchTimetable(profile?.activeEnrollment?.sectionId) 
  };
};
