import API from '../../../utils/axiosInstance';

export const getInternalMarks = (params) => API.get('/academic/internal-marks', { params });
export const saveInternalMarks = (data) => API.post('/academic/internal-marks', data);
export const getMyMarks = (studentId) => API.get('/academic/internal-marks/my-marks', { params: { studentId } });
