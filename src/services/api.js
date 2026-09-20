import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://tutors-be.onrender.com/api'}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor tự động gắn token JWT và chuẩn hóa multipart boundary khi gửi file
api.interceptors.request.use(
  (config) => {
    // Khi gửi FormData, bắt buộc xóa Content-Type cố định để browser/Axios tự sinh header multipart/form-data kèm boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    const token = localStorage.getItem('giasuhq_token') || sessionStorage.getItem('giasuhq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
