import API from '../../../utils/axiosInstance';

const API_URL = '/academic/semester-subject-mappings';

export const getMappings = async (params) => {
  const response = await API.get(API_URL, { params });
  return response.data;
};

export const createMapping = async (data) => {
  const response = await API.post(API_URL, data);
  return response.data;
};

export const bulkCreateMappings = async (data) => {
  const response = await API.post(`${API_URL}/bulk`, data);
  return response.data;
};

export const deleteMapping = async (id) => {
  const response = await API.delete(`${API_URL}/${id}`);
  return response.data;
};
