import api from './api';

export const reviewService = {
  // Get salon reviews
  getSalonReviews: async (salonId) => {
    try {
      const response = await api.get(`/reviews/salon/${salonId}/`);
      const data = response.data?.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching reviews for salon ${salonId}:`, error);
      return [];
    }
  },

  // Get salon rating
  getSalonRating: async (salonId) => {
    try {
      const response = await api.get(`/reviews/salon/${salonId}/rating/`);
      return response.data || { average_rating: 0, total_reviews: 0 };
    } catch (error) {
      return { average_rating: 0, total_reviews: 0 };
    }
  },

  // Create review
  create: async (data) => {
    const response = await api.post('/reviews/create/', data);
    return response.data;
  }
};
