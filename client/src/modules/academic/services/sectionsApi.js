import API from '../../../utils/axiosInstance';

export const getSections = (params) => API.get('/academic/sections', { params });
export const getSectionById = (id) => API.get(`/academic/sections/${id}`);
export const createSection = (data) => API.post('/academic/sections', data);
export const updateSection = (id, data) => API.put(`/academic/sections/${id}`, data);
export const updateSectionStatus = (id, status) => API.patch(`/academic/sections/${id}/status`, { status });
