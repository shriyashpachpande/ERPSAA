import API from '../../../utils/axiosInstance';

const API_URL = '/academic/semesters';

export const getSemesters = async (params) => {
  const response = await API.get(API_URL, { params });
  return response.data;
};

export const createSemester = async (data) => {
  const response = await API.post(API_URL, data);
  return response.data;
};

export const updateSemester = async (id, data) => {
  const response = await API.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const toggleSemesterStatus = async (id, status) => {
  const response = await API.patch(`${API_URL}/${id}/status`, { status });
  return response.data;
};
