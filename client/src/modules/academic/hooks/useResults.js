import { useState, useCallback } from 'react';
import * as resultsApi from '../services/resultsApi';

export const useResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await resultsApi.getResults(params);
      setResults(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }, []);

  const generate = async (data) => {
    setLoading(true);
    try {
      return await resultsApi.generateResults(data);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const publish = async (data) => {
    setLoading(true);
    try {
      return await resultsApi.publishResults(data);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Publishing failed');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, fetchResults, generate, publish };
};
