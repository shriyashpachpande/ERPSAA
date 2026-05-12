import axiosInstance from '../../../utils/axiosInstance';

export const departmentsApi = {
  getAllDepartments: async () => {
    const response = await axiosInstance.get('/academic/departments');
    return response.data.data;
  },

  getDepartment: async (id) => {
    const response = await axiosInstance.get(`/academic/departments/${id}`);
    return response.data.data;
  },

  createDepartment: async (data) => {
    const response = await axiosInstance.post('/academic/departments', data);
    return response.data.data;
  },

  updateDepartment: async (id, data) => {
    const response = await axiosInstance.put(`/academic/departments/${id}`, data);
    return response.data.data;
  },

  deleteDepartment: async (id) => {
    const response = await axiosInstance.delete(`/academic/departments/${id}`);
    return response.data;
  }
};
