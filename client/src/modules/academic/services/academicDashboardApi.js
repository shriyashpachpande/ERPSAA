import API from '../../../utils/axiosInstance';

export const getDashboardStats = () => API.get('/academic/dashboard/stats');
export const getQuickActions = () => API.get('/academic/dashboard/actions');
