import axios from 'axios';

// The base URL routes to the new module 2 api
const API_URL = '/api/student-master/';

// Helper to bundle JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getMyMasterProfile = async () => {
  const response = await axios.get(`${API_URL}me`, getAuthHeaders());
  return response.data;
};

export const getAllStudents = async (params = {}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role === 'student' || user.role === 'guest') {
    console.warn('[ERPSAA_SECURITY] Blocked unauthorized student directory fetch from student role.');
    console.trace();
    return { success: false, data: [], message: 'Access restricted' };
  }
  const response = await axios.get(API_URL, { ...getAuthHeaders(), params });
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await axios.get(`${API_URL}${id}`, getAuthHeaders());
  return response.data;
};

export const updateStudentMaster = async (id, data) => {
  const response = await axios.put(`${API_URL}${id}`, data, getAuthHeaders());
  return response.data;
};
