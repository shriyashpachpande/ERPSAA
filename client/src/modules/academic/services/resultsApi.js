import API from '../../../utils/axiosInstance';

export const generateResults = (data) => API.post('/academic/results/generate', data);
export const publishResults = (data) => API.post('/academic/results/publish', data);
export const getResults = (params) => API.get('/academic/results', { params }); // Note: I need to add the GET route if missing, but focusing on generation first.
