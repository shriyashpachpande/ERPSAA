import { useState, useCallback } from 'react';
import * as marksApi from '../services/internalMarksApi';

export const useInternalMarks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMarks = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await marksApi.getInternalMarks(params);
      setMarks(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch marks');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyMarks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await marksApi.getMyMarks();
      setMarks(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch student marks');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveMarks = async (data) => {
    setLoading(true);
    try {
      const response = await marksApi.saveInternalMarks(data);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to save marks');
    } finally {
      setLoading(false);
    }
  };

  return { marks, loading, error, fetchMarks, fetchMyMarks, saveMarks };
};
