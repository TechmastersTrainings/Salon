import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import tokenService from '../services/tokenService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      sessionExpiry: null,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/accounts/login/', credentials);
          const { access, refresh, user } = response.data;

          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);

          const expiry = Date.now() + 24 * 60 * 60 * 1000;
          set({
            user,
            token: access,
            sessionExpiry: expiry,
            isLoading: false
          });

          tokenService.init(user, () => {
            get().logout();
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          
          let errorMessage = 'Login failed';
          let errorFields = {};

          if (error.response?.data) {
            const errorData = error.response.data;
            if (typeof errorData === 'object' && !errorData.detail && !errorData.error) {
              errorFields = errorData;
              const firstKey = Object.keys(errorData)[0];
              const firstVal = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey];
              errorMessage = `${firstKey}: ${firstVal}`;
            } else {
              errorMessage = errorData.error || errorData.detail || 'Invalid credentials';
            }
          } else {
            errorMessage = 'Cannot connect to authentication server. Please check your network connection.';
          }
          
          return { 
            success: false, 
            error: errorMessage,
            fields: errorFields 
          };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/accounts/register/', userData);
          set({ isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          set({ isLoading: false });

          let errorMessage = 'Registration failed';
          if (error.response?.data) {
            const errorData = error.response.data;
            if (typeof errorData === 'object') {
              const firstError = Object.values(errorData)[0];
              errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            } else {
              errorMessage = errorData;
            }
          } else {
            errorMessage = 'Cannot connect to authentication server.';
          }
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        tokenService.cleanup();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, token: null, sessionExpiry: null });
      },

      checkAuth: () => {
        const token = localStorage.getItem('access_token');
        const { user } = get();
        
        if (token && user) {
          const { sessionExpiry } = get();
          if (sessionExpiry && Date.now() > sessionExpiry) {
            get().logout();
            return;
          }
          set({ token });
          tokenService.init(user, () => {
            get().logout();
          });
        }
      },

      refreshAccessToken: async () => {
        try {
          const newToken = await tokenService.refreshToken();
          if (newToken) {
            set({ token: newToken });
            const expiry = Date.now() + 30 * 60 * 1000;
            set({ sessionExpiry: expiry });
          }
          return newToken;
        } catch (error) {
          console.error('Failed to refresh token:', error);
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);
