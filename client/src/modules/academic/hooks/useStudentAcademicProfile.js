import { useState, useEffect, useCallback } from 'react';
import * as enrollmentsApi from '../services/studentSemesterEnrollmentsApi';

export const useStudentAcademicProfile = (studentId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (studentId && studentId !== 'undefined') {
        response = await enrollmentsApi.getStudentAcademicProfile(studentId);
      } else {
        response = await enrollmentsApi.getMyAcademicProfile();
      }
      setProfile(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch academic profile');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile
  };
};
