import API from '../../../utils/axiosInstance';

export const getEligibleStudents = (params) => API.get('/academic/enrollments/eligible-students', { params });
export const enrollStudent = (data) => API.post('/academic/enrollments/enroll', data);
export const getEnrollments = (params) => API.get('/academic/enrollments', { params });
export const updateEnrollment = (id, data) => API.put(`/academic/enrollments/${id}`, data);
export const getStudentAcademicProfile = (studentId) => API.get(`/academic/enrollments/profile/${studentId}`);
export const getMyAcademicProfile = () => API.get('/academic/enrollments/my-profile');
