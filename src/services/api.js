import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem('session') || 'null');
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Handle 401 responses by clearing session
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const session = JSON.parse(localStorage.getItem('session') || 'null');
      if (session?.refresh_token && !error.config._retry) {
        error.config._retry = true;
        try {
          const { data } = await axios.post('/api/auth/refresh-token', {
            refresh_token: session.refresh_token,
          });
          if (data.success) {
            localStorage.setItem('session', JSON.stringify(data.data));
            error.config.headers.Authorization = `Bearer ${data.data.access_token}`;
            return api(error.config);
          }
        } catch {
          // Refresh failed, clear session
        }
      }
      localStorage.removeItem('session');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// =====================================================
// AUTH API
// =====================================================

export const authAPI = {
  signUp: (data) => api.post('/auth/signup', data),
  signIn: (data) => api.post('/auth/signin', data),
  signOut: () => api.post('/auth/signout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  refreshToken: (refresh_token) => api.post('/auth/refresh-token', { refresh_token }),
  googleSignIn: (data) => api.post('/auth/google', data),
  getGoogleAuthUrl: () => api.get('/auth/google/url'),
};

// =====================================================
// REGISTRATION API
// =====================================================

export const registrationAPI = {
  getEventInfo: () => api.get('/registrations/event-info'),
  register: (data) => api.post('/registrations/register', data),
  getMyRegistrations: () => api.get('/registrations/my-registrations'),
  getById: (id) => api.get(`/registrations/${id}`),
  update: (id, data) => api.put(`/registrations/${id}`, data),
};

export default api;
