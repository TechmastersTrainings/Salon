import api from './api';

class TokenService {
  constructor() {
    this.refreshTimeout = null;
    this.onLogout = null;
  }

  init(user, onLogout) {
    if (!user) return;
    this.onLogout = onLogout;
    this.startRefreshTimer();
  }

  cleanup() {
    this.stopRefreshTimer();
  }

  startRefreshTimer() {
    // Refresh token every 25 minutes (5 minutes before 30-minute expiry)
    this.refreshTimeout = setInterval(() => {
      this.refreshToken();
    }, 25 * 60 * 1000);
  }

  stopRefreshTimer() {
    if (this.refreshTimeout) {
      clearInterval(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return;

      const response = await api.post('/token/refresh/', {
        refresh: refreshToken
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);
      
      return access;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.handleRefreshFailure();
    }
  }

  handleRefreshFailure() {
    this.cleanup();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (this.onLogout) {
      this.onLogout();
    }
    window.location.href = '/login?session=expired';
  }
}

const tokenService = new TokenService();
export default tokenService;