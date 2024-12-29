import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor to add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

const ApiService = {
  // Auth endpoints
  async signup(userData, rememberMe = false) {
    try {
      const response = await api.post('/auth/signup', userData);
      const { token, user } = response.data;
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
      return { user, token };
    } catch (error) {
      throw error?.error || 'An error occurred during signup';
    }
  },

  async login(email, password, rememberMe = false) {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
      return { user, token };
    } catch (error) {
      throw error?.error || 'Invalid email or password';
    }
  },

  async socialLogin(provider, token, rememberMe = false) {
    try {
      const response = await api.post('/auth/social', { provider, token });
      const { token: authToken, user } = response.data;
      if (rememberMe) {
        localStorage.setItem('token', authToken);
      } else {
        sessionStorage.setItem('token', authToken);
      }
      return { user, token: authToken };
    } catch (error) {
      throw error?.error || 'Social login failed';
    }
  },

  async logout() {
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async getChatHistory() {
    try {
      const response = await api.get('/chat/history');
      return response.data;
    } catch (error) {
      throw error?.error || 'Failed to fetch chat history';
    }
  }
};

export default ApiService;