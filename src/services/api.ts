import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login for critical protected endpoints
      // Don't auto-redirect for endpoints that gracefully handle auth failures
      const skipRedirectEndpoints = ['/Products', '/Reviews', '/Wishlist'];
      const requestUrl = error.config?.url || '';
      const shouldSkipRedirect = skipRedirectEndpoints.some(endpoint => 
        requestUrl.startsWith(endpoint)
      );
      
      if (!shouldSkipRedirect) {
        // Clear token and redirect to login if unauthorized on protected endpoint
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
