import api from './api';

export const authService = {
  // Đăng ký tài khoản mới
  async register(data) {
    const response = await api.post('/auth/register', data);
    if (response.data?.data?.token) {
      localStorage.setItem('giasuhq_token', response.data.data.token);
      localStorage.setItem('giasuhq_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Đăng nhập
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.data?.token) {
      localStorage.setItem('giasuhq_token', response.data.data.token);
      localStorage.setItem('giasuhq_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Lấy thông tin user hiện tại từ Token
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    if (response.data?.data) {
      localStorage.setItem('giasuhq_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem('giasuhq_token');
    localStorage.removeItem('giasuhq_user');
  },

  // Lấy user từ localStorage
  getSavedUser() {
    const userStr = localStorage.getItem('giasuhq_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('giasuhq_token');
  }
};
