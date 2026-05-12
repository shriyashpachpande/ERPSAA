import API from '../../../utils/axiosInstance';

export const getAllocations = (params) => API.get('/academic/faculty-allocations', { params });
export const getAllocationById = (id) => API.get(`/academic/faculty-allocations/${id}`);
export const createAllocation = (data) => API.post('/academic/faculty-allocations', data);
export const updateAllocation = (id, data) => API.put(`/academic/faculty-allocations/${id}`, data);
export const updateAllocationStatus = (id, status) => API.patch(`/academic/faculty-allocations/${id}/status`, { status });
export const getMyAllocations = (params) => API.get('/academic/faculty-allocations/my-allocations', { params });
