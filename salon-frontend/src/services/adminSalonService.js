import api from './api';

export const adminSalonService = {
  // Get all salons - using existing endpoint
  getSalons: async () => {
    try {
      const response = await api.get('/salons/');
      // Handle paginated response
      return response.data.results || response.data || [];
    } catch (error) {
      console.error('Error fetching salons:', error);
      throw error;
    }
  },

  // Get single salon
  getSalonById: async (id) => {
    try {
      const response = await api.get(`/salons/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching salon:', error);
      throw error;
    }
  },

  // Create salon - using existing endpoint
  createSalon: async (salonData) => {
    try {
      const response = await api.post('/salons/create/', salonData);
      return response.data;
    } catch (error) {
      console.error('Error creating salon:', error);
      throw error;
    }
  },

  // Update salon - using existing endpoint
  updateSalon: async (id, salonData) => {
    try {
      const response = await api.put(`/salons/${id}/`, salonData);
      return response.data;
    } catch (error) {
      console.error('Error updating salon:', error);
      throw error;
    }
  },

  // Delete salon (soft delete) - using existing endpoint
  deleteSalon: async (id) => {
    try {
      const response = await api.delete(`/salons/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting salon:', error);
      throw error;
    }
  },

  // Toggle salon status - using existing endpoint
  toggleSalonStatus: async (id) => {
    try {
      // First get current salon
      const salon = await api.get(`/salons/${id}/`);
      // Then update with opposite status
      const response = await api.patch(`/salons/${id}/`, {
        is_active: !salon.data.is_active
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling salon status:', error);
      throw error;
    }
  },

  // Get all owners for dropdown
  getOwners: async () => {
    try {
      const response = await api.get('/accounts/users/?role=owner');
      return response.data.results || response.data || [];
    } catch (error) {
      console.error('Error fetching owners:', error);
      return [];
    }
  }
};