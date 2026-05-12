import { useState, useEffect, useCallback } from 'react';
import * as enrollmentsApi from '../services/studentSemesterEnrollmentsApi';

export const useStudentSemesterEnrollments = (filters = {}) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filtersStr = JSON.stringify(filters);

  const fetchEnrollments = useCallback(async (params) => {
    const fetchParams = params || JSON.parse(filtersStr);
    setLoading(true);
    try {
      const response = await enrollmentsApi.getEnrollments(fetchParams);
      const data = response.data?.data || response.data;
      setEnrollments(data);
      setError(null);
      return response.data; // Return the full response object as expected by InternalMarksEntryForm
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch enrollments');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filtersStr]);

  const enrollStudent = async (data) => {
    try {
      const response = await enrollmentsApi.enrollStudent(data);
      await fetchEnrollments();
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to enroll student');
    }
  };

  const updateEnrollment = async (id, data) => {
    try {
      await enrollmentsApi.updateEnrollment(id, data);
      await fetchEnrollments();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update enrollment');
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    enrollStudent,
    updateEnrollment
  };
};
