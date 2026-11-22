import api from './api';

export const salonService = {
  getAll: async () => {
    try {
      const response = await api.get('/salons/');
      const data = response.data?.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching salons:', error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/salons/${id}/`);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching salon ${id}:`, error);
      return null;
    }
  },

  search: async (params = {}) => {
    try {
      const cleanParams = {};
      if (params.q) cleanParams.name = params.q;
      if (params.name) cleanParams.name = params.name;
      if (params.city) cleanParams.city = params.city;
      if (params.location) cleanParams.city = params.location;
      
      const response = await api.get('/salons/search/', { params: cleanParams });
      const data = response.data?.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error searching salons:', error);
      return [];
    }
  },

  getNearby: async (lat, lng, radius = 50) => {
    try {
      const response = await api.get('/salons/search/nearby/', {
        params: { lat, lng, radius }
      });
      const data = response.data?.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching nearby salons:', error);
      return [];
    }
  },

  create: async (data) => {
    const response = await api.post('/salons/create/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/salons/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/salons/${id}/`);
    return response.data;
  },

  getMySalons: async () => {
    try {
      const response = await api.get('/salons/my-salons/');
      const data = response.data?.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching my salons:', error);
      return [];
    }
  }
};
