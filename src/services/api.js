import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor tự động gắn token JWT từ localStorage hoặc sessionStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('giasuhq_token') || sessionStorage.getItem('giasuhq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
