import axios from 'axios';

const API_URL = '/api/hostel/allocation';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getAllocationHostels = async () => {
  const res = await axios.get(`${API_URL}/hostels`, getAuthHeaders());
  return res.data;
};

export const getHostelHierarchy = async (hostelId) => {
  const res = await axios.get(`${API_URL}/hierarchy/${hostelId}`, getAuthHeaders());
  return res.data;
};

export const getRoomBeds = async (roomId) => {
  const res = await axios.get(`${API_URL}/beds/${roomId}`, getAuthHeaders());
  return res.data;
};

export const getAllocationReadyStudents = async () => {
  const res = await axios.get(`${API_URL}/students`, getAuthHeaders());
  return res.data;
};

export const assignBed = async (payload) => {
  const res = await axios.post(`${API_URL}/assign`, payload, getAuthHeaders());
  return res.data;
};
