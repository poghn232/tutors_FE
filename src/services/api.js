import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}`;

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

// Interceptor chuẩn hóa thông báo lỗi 401 / 403 khi Token hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (!error.response.data || typeof error.response.data !== 'object') {
        error.response.data = {};
      }
      if (!error.response.data.message) {
        error.response.data.message = 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng xuất và đăng nhập lại.';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
