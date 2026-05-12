import API from '../../../utils/axiosInstance';

const API_URL = '/academic/structure/years';

export const getYears = async (params) => {
  const response = await API.get(API_URL, { params });
  return response.data;
};

export const createYear = async (data) => {
  const response = await API.post(API_URL, data);
  return response.data;
};

export const updateYear = async (id, data) => {
  const response = await API.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const setCurrentYear = async (id) => {
  const response = await API.patch(`${API_URL}/${id}/set-current`);
  return response.data;
};

export const toggleYearStatus = async (id, status) => {
  const response = await API.patch(`${API_URL}/${id}/status`, { status });
  return response.data;
};
