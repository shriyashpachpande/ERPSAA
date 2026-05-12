import API from '../../../../utils/axiosInstance';

const API_URL = '/academic/attendance';

export const getSubjectsForSection = (sectionId) => API.get(`${API_URL}/subjects`, { params: { sectionId } });
export const getStudentsForSection = (sectionId) => API.get(`${API_URL}/students`, { params: { sectionId } });
export const markAttendance = (data) => API.post(`${API_URL}/mark`, data);
export const getMyAttendanceStats = () => API.get(`${API_URL}/my-stats`);
export const getSessions = (params) => API.get(`${API_URL}/sessions`, { params });
export const getStudentStats = (studentMasterId) => API.get(`${API_URL}/student-stats/${studentMasterId}`);
