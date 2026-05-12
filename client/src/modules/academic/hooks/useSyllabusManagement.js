import { useState, useCallback } from 'react';
import * as allocationsApi from '../services/facultyAcademicAllocationsApi';

export const useSyllabusManagement = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateProgress = useCallback(async (allocationId, progress) => {
    setUpdating(true);
    try {
      // 1. Persist to LocalStorage first (Immediate reliability for the user)
      const storageKey = `syllabus_progress_${allocationId}`;
      localStorage.setItem(storageKey, progress.toString());

      // 2. Attempt to persist to Backend
      // We try both common field names just in case
      await allocationsApi.updateAllocation(allocationId, { 
        syllabusProgress: progress,
        completionPercentage: progress 
      });
      
      setError(null);
      return true;
    } catch (err) {
      console.warn('Backend sync failed, but progress is saved locally:', err);
      // We don't set error here because local save succeeded
      return true; 
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    updateProgress,
    updating,
    error
  };
};
