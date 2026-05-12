import API from '../../../utils/axiosInstance';

export const getTimetableEntries = (params) => API.get('/academic/timetable', { params });
export const createTimetableEntry = (data) => API.post('/academic/timetable', data);
export const updateTimetableEntry = (id, data) => API.put(`/academic/timetable/${id}`, data);
export const deleteTimetableEntry = (id) => API.delete(`/academic/timetable/${id}`);
export const getMyTimetable = () => API.get('/academic/timetable/my-timetable');
export const getSectionTimetable = (sectionId) => API.get(`/academic/timetable/section/${sectionId}`);
export const getFacultyTimetable = (facultyId) => API.get(`/academic/timetable/faculty/${facultyId}`);
