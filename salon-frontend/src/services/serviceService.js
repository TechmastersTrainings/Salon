import api from './api';

export const serviceService = {
  // Get all services
  getAll: async (params) => {
    const response = await api.get('/services/', { params });
    return response.data;
  },

  // Get services by salon
  getBySalon: async (salonId) => {
    const response = await api.get(`/services/salon/${salonId}/`);
    return response.data;
  },

  // Create service (owner only)
  create: async (data) => {
    const response = await api.post('/services/create/', data);
    return response.data;
  },

  // Update service (owner only)
  update: async (id, data) => {
    const response = await api.put(`/services/${id}/update/`, data);
    return response.data;
  },

  // Toggle service status
  toggleStatus: async (id) => {
    const response = await api.post(`/services/${id}/toggle-status/`);
    return response.data;
  },
};