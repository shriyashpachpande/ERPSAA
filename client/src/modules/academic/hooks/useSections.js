import { useState, useEffect, useCallback } from 'react';
import * as sectionsApi from '../services/sectionsApi';

export const useSections = (filters = {}) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filtersStr = JSON.stringify(filters);

  const fetchSections = useCallback(async (params) => {
    const fetchParams = params || JSON.parse(filtersStr);
    setLoading(true);
    try {
      const response = await sectionsApi.getSections(fetchParams);
      setSections(response.data?.data || response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  }, [filtersStr]);

  const addSection = async (data) => {
    try {
      const response = await sectionsApi.createSection(data);
      await fetchSections();
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create section');
    }
  };

  const updateSection = async (id, data) => {
    try {
      await sectionsApi.updateSection(id, data);
      await fetchSections();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update section');
    }
  };

  const toggleSectionStatus = async (id, status) => {
    try {
      await sectionsApi.updateSectionStatus(id, status);
      await fetchSections();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update section status');
    }
  };

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  return {
    sections,
    loading,
    error,
    fetchSections,
    addSection,
    updateSection,
    toggleSectionStatus
  };
};
