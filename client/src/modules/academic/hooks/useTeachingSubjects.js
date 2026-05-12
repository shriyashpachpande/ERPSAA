import { useState, useEffect, useCallback } from 'react';
import * as allocationsApi from '../services/facultyAcademicAllocationsApi';
import * as facultyApi from '../services/facultyManagementApi';
import { useAuth } from '../../../hooks/useAuth';

export const useTeachingSubjects = (filters = {}) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facultyProfileId, setFacultyProfileId] = useState(null);
  const [isResolvingProfile, setIsResolvingProfile] = useState(false);

  const filtersStr = JSON.stringify(filters);

  // 1. Resolve Faculty Profile ID once on mount
  useEffect(() => {
    if (user && user.role === 'faculty') {
      setIsResolvingProfile(true);
      const resolveProfile = async () => {
        try {
          const response = await facultyApi.getFacultyList();
          const facultyArray = response.data || response || [];
          
          if (Array.isArray(facultyArray)) {
            const myProfile = facultyArray.find(f => f.user?._id === user._id || f.user === user._id);
            if (myProfile) {
              setFacultyProfileId(myProfile._id);
            }
          }
        } catch (err) {
          console.error('Profile resolution failed', err);
        } finally {
          setIsResolvingProfile(false);
        }
      };
      resolveProfile();
    } else {
      setIsResolvingProfile(false);
    }
  }, [user?._id, user?.role]);

  // 2. Main Fetch Logic
  const fetchSubjects = useCallback(async () => {
    if (!user || isResolvingProfile) return;
    
    setLoading(true);

    try {
      const currentFilters = JSON.parse(filtersStr);
      const cleanFilters = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== '')
      );
      
      let params = { ...cleanFilters };
      let response;

      if (user.role === 'hod') {
        params.department = user.department;
        response = await allocationsApi.getAllocations(params);
      } else if (user.role === 'faculty') {
        if (facultyProfileId) {
          params.faculty = facultyProfileId;
          response = await allocationsApi.getAllocations(params);
        } else {
          response = await allocationsApi.getMyAllocations(params);
        }
      } else {
        response = await allocationsApi.getAllocations(params);
      }

      let data = response.data?.data || response.data || [];
      
      // Client-side filtering as fallback
      if (cleanFilters.academicYearId || cleanFilters.semesterId || cleanFilters.faculty) {
        data = data.filter(item => {
          let match = true;
          if (cleanFilters.academicYearId) {
            const itemYearId = item.academicYearId?._id || item.academicYearId;
            if (itemYearId !== cleanFilters.academicYearId) match = false;
          }
          if (cleanFilters.semesterId) {
            const itemSemId = item.semesterId?._id || item.semesterId;
            if (itemSemId !== cleanFilters.semesterId) match = false;
          }
          if (cleanFilters.faculty && user.role === 'hod') {
            const itemFacultyId = item.faculty?._id || item.faculty;
            if (itemFacultyId !== cleanFilters.faculty) match = false;
          }
          return match;
        });
      }

      // HYBRID SYNC: Merge LocalStorage progress data
      const enrichedData = data.map(item => {
        const localProgress = localStorage.getItem(`syllabus_progress_${item._id}`);
        if (localProgress !== null) {
          return { ...item, syllabusProgress: parseInt(localProgress) };
        }
        return item;
      });

      setSubjects(enrichedData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch teaching subjects');
    } finally {
      setLoading(false);
    }
  }, [user, filtersStr, facultyProfileId, isResolvingProfile]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    loading: loading || isResolvingProfile,
    error,
    refresh: fetchSubjects
  };
};
