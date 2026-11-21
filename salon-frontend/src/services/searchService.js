import api from './api';

export const searchService = {
  global: async (query) => {
    try {
      const response = await api.get('/salons/search/', { params: { name: query } });
      const data = response.data?.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in global search:', error);
      return [];
    }
  },

  nearby: async (lat, lng, radius = 50) => {
    try {
      const response = await api.get('/salons/search/nearby/', {
        params: { lat, lng, radius }
      });
      const data = response.data?.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in nearby search:', error);
      return [];
    }
  },
};
