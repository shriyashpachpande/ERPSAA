import API from '../../../utils/axiosInstance';

const API_URL = '/academic/subjects';

export const getSubjects = async (params) => {
  const response = await API.get(API_URL, { params });
  return response.data;
};

export const createSubject = async (data) => {
  const response = await API.post(API_URL, data);
  return response.data;
};

export const updateSubject = async (id, data) => {
  const response = await API.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const toggleSubjectStatus = async (id, status) => {
  const response = await API.patch(`${API_URL}/${id}/status`, { status });
  return response.data;
};
