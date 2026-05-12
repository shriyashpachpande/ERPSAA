import axios from 'axios';

const API_URL = '/api/hostel';

// Helper to bundle JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// ─── Student Services ────────────────────────────────────────────────────────
export const applyForHostel = async (formData) => {
  const res = await axios.post(`${API_URL}/apply`, formData, getAuthHeaders());
  return res.data;
};

export const getMyApplication = async () => {
  const res = await axios.get(`${API_URL}/my-application`, getAuthHeaders());
  return res.data;
};

export const getMyRoom = async () => {
  const res = await axios.get(`${API_URL}/my-room`, getAuthHeaders());
  return res.data;
};

export const submitComplaint = async (complaintData) => {
  const res = await axios.post(`${API_URL}/complaints`, complaintData, getAuthHeaders());
  return res.data;
};

export const getMyComplaints = async () => {
  const res = await axios.get(`${API_URL}/my-complaints`, getAuthHeaders());
  return res.data;
};

export const submitMaintenanceRequest = async (requestData) => {
  const res = await axios.post(`${API_URL}/maintenance`, requestData, getAuthHeaders());
  return res.data;
};

export const getMyRequests = async () => {
  const res = await axios.get(`${API_URL}/my-requests`, getAuthHeaders());
  return res.data;
};

// ─── Staff Services ──────────────────────────────────────────────────────────
export const getHostelDashboardStats = async () => {
  const res = await axios.get(`${API_URL}/staff/dashboard`, getAuthHeaders());
  return res.data;
};

export const getAllApplications = async () => {
  const res = await axios.get(`${API_URL}/staff/applications`, getAuthHeaders());
  return res.data;
};

export const updateApplicationStatus = async (id, statusData) => {
  const res = await axios.put(`${API_URL}/staff/applications/${id}/status`, statusData, getAuthHeaders());
  return res.data;
};

export const allocateBed = async (allocationData) => {
  const res = await axios.post(`${API_URL}/staff/allocate`, allocationData, getAuthHeaders());
  return res.data;
};

export const vacateBed = async (id) => {
  const res = await axios.put(`${API_URL}/staff/vacate/${id}`, {}, getAuthHeaders());
  return res.data;
};

export const getHostelsSummary = async () => {
  const res = await axios.get(`${API_URL}/staff/hostels-summary`, getAuthHeaders());
  return res.data;
};

export const getHostelOccupancy = async (hostelId) => {
  const res = await axios.get(`${API_URL}/staff/occupancy/${hostelId}`, getAuthHeaders());
  return res.data;
};

export const getAllComplaints = async () => {
  const res = await axios.get(`${API_URL}/staff/complaints`, getAuthHeaders());
  return res.data;
};

export const updateComplaintStatus = async (id, statusData) => {
  const res = await axios.put(`${API_URL}/staff/complaints/${id}`, statusData, getAuthHeaders());
  return res.data;
};

export const getAllMaintenanceRequests = async () => {
  const res = await axios.get(`${API_URL}/staff/requests`, getAuthHeaders());
  return res.data;
};

export const updateMaintenanceRequestStatus = async (id, statusData) => {
  const res = await axios.put(`${API_URL}/staff/requests/${id}`, statusData, getAuthHeaders());
  return res.data;
};

export const checkInStudent = async (checkInData) => {
  const res = await axios.post(`${API_URL}/staff/check-in`, checkInData, getAuthHeaders());
  return res.data;
};

export const checkOutStudent = async (checkOutData) => {
  const res = await axios.post(`${API_URL}/staff/check-out`, checkOutData, getAuthHeaders());
  return res.data;
};

export const getStudentLogs = async (studentId) => {
  const res = await axios.get(`${API_URL}/staff/logs/${studentId}`, getAuthHeaders());
  return res.data;
};

export const getCheckInOutStats = async () => {
  const res = await axios.get(`${API_URL}/staff/check-in-out/stats`, getAuthHeaders());
  return res.data;
};

export const getStudentHostelProfile = async (studentId) => {
  const res = await axios.get(`${API_URL}/staff/student-profile/${studentId}`, getAuthHeaders());
  return res.data;
};
