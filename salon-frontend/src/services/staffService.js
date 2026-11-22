import api from './api';

export const staffService = {
  // Get all staff
  getAll: async (params) => {
    const response = await api.get('/staff/', { params });
    return response.data;
  },

  // Get staff by salon
  getBySalon: async (salonId) => {
    const response = await api.get(`/staff/salon/${salonId}/`);
    return response.data;
  },

  // Create staff (owner only)
  create: async (data) => {
    const response = await api.post('/staff/create/', data);
    return response.data;
  },

  // Update staff
  update: async (id, data) => {
    const response = await api.put(`/staff/${id}/`, data);
    return response.data;
  },

  // Get staff schedules
  getSchedules: async (staffId) => {
    const response = await api.get(`/staff/${staffId}/schedules/`);
    return response.data;
  },

  // Get staff dashboard
  getDashboard: async (staffId) => {
    const response = await api.get(`/staff/${staffId}/dashboard/`);
    return response.data;
  },
};