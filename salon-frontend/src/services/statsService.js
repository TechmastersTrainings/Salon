import api from './api';

export const statsService = {
  getPlatformStats: async () => {
    try {
      const response = await api.get('/stats/platform/');
      return response.data || { total_salons: 0, total_customers: 0, total_bookings: 0 };
    } catch (error) {
      return { total_salons: 0, total_customers: 0, total_bookings: 0 };
    }
  }
};
