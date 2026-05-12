import API from '../../../utils/axiosInstance';

const API_URL = '/academic/faculty';

/**
 * Fetch all faculty with optional filters
 */
export const getFacultyList = async (params = {}) => {
  const response = await API.get(API_URL, { params });
  return response.data;
};

/**
 * Create a new faculty member
 */
export const createFaculty = async (facultyData) => {
  const response = await API.post(API_URL, facultyData);
  return response.data;
};

/**
 * Fetch a single faculty member
 */
export const getFacultyById = async (id) => {
  const response = await API.get(`${API_URL}/${id}`);
  return response.data;
};

/**
 * Update faculty status
 */
export const toggleFacultyStatus = async (id, status) => {
  const response = await API.patch(`${API_URL}/${id}/status`, { status });
  return response.data;
};

/**
 * Delete a faculty member safely
 */
export const deleteFaculty = async (id) => {
  const response = await API.delete(`${API_URL}/${id}`);
  return response.data;
};
