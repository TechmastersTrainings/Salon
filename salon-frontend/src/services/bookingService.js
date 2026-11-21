import api from './api';

export const bookingService = {
  // Get services for a salon
  getServices: async (salonId) => {
    try {
      const response = await api.get(`/services/salon/${salonId}/`);
      const data = response.data?.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching services for salon ${salonId}:`, error);
      return [];
    }
  },

  // Get staff for a salon
  getStaff: async (salonId) => {
    try {
      const response = await api.get(`/staff/salon/${salonId}/`);
      const data = response.data?.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching staff for salon ${salonId}:`, error);
      return [];
    }
  },

  // Get available slots
  getAvailableSlots: async (salonId, staffId, date, serviceId) => {
    try {
      const response = await api.get('/bookings/available-slots/', {
        params: {
          salon_id: salonId,
          staff_id: staffId,
          date: date,
          service_id: serviceId
        }
      });
      if (response.data?.available_slots?.length > 0) {
        return response.data.available_slots;
      }
      return ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    } catch (error) {
      return ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    }
  },

  // Create booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings/');
      const data = response.data?.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },

  // Get booking history
  getBookingHistory: async () => {
    return bookingService.getMyBookings();
  },

  // Get single booking
  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}/`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel/`);
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status/`, { status });
    return response.data;
  }
};
