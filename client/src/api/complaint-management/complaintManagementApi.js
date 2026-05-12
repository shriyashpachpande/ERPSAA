import axios from 'axios';

const API_URL = '/api/complaints';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const complaintManagementApi = {
    createComplaint: (formData) => axios.post(`${API_URL}/create`, formData, {
        headers: { 
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data'
        }
    }),
    
    getMyComplaints: () => axios.get(`${API_URL}/my-list`, getAuthHeader()),
    
    getMyStatus: () => axios.get(`${API_URL}/my-status`, getAuthHeader()),
    
    getComplaintDetails: (id) => axios.get(`${API_URL}/details/${id}`, getAuthHeader()),
    
    getTimeline: (id) => axios.get(`${API_URL}/timeline/${id}`, getAuthHeader()),
    
    addMessage: (id, data) => axios.post(`${API_URL}/add-message/${id}`, data, getAuthHeader()),
    
    getAssignedQueue: (status) => axios.get(`${API_URL}/assigned-queue${status ? `?status=${status}` : ''}`, getAuthHeader()),
    
    getDepartmentQueue: (status, all) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (all) params.append('all', 'true');
        const queryString = params.toString();
        return axios.get(`${API_URL}/department-queue${queryString ? `?${queryString}` : ''}`, getAuthHeader());
    },
    
    assignHandler: (id, handlerId) => axios.put(`${API_URL}/assign-handler/${id}`, { handlerId }, getAuthHeader()),
    
    updateStatus: (id, status, remarks) => axios.put(`${API_URL}/update-status/${id}`, { status, remarks }, getAuthHeader()),
    
    resolveComplaint: (id, summary) => axios.put(`${API_URL}/resolve/${id}`, { summary }, getAuthHeader()),
    
    rejectComplaint: (id, reason) => axios.put(`${API_URL}/reject/${id}`, { reason }, getAuthHeader()),
    
    reopenComplaint: (id, reason) => axios.put(`${API_URL}/reopen/${id}`, { reason }, getAuthHeader()),
    
    closeComplaint: (id) => axios.put(`${API_URL}/close/${id}`, {}, getAuthHeader()),
    
    escalateComplaint: (id, reason) => axios.put(`${API_URL}/escalate/${id}`, { reason }, getAuthHeader()),
    
    submitFeedback: (id, feedback) => axios.post(`${API_URL}/submit-feedback/${id}`, feedback, getAuthHeader()),
    
    getAnalytics: () => axios.get(`${API_URL}/analytics-summary`, getAuthHeader())
};

export default complaintManagementApi;
