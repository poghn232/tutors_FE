import api from './api';

export const authService = {
  // Lưu token & user tùy theo lựa chọn Remember Me
  saveSession(token, user, rememberMe = true) {
    if (rememberMe) {
      localStorage.setItem('giasuhq_token', token);
      localStorage.setItem('giasuhq_user', JSON.stringify(user));
      localStorage.setItem('giasuhq_remember_me', 'true');
      if (user?.email) {
        localStorage.setItem('giasuhq_remember_email', user.email);
      }
      sessionStorage.removeItem('giasuhq_token');
      sessionStorage.removeItem('giasuhq_user');
    } else {
      sessionStorage.setItem('giasuhq_token', token);
      sessionStorage.setItem('giasuhq_user', JSON.stringify(user));
      localStorage.removeItem('giasuhq_token');
      localStorage.removeItem('giasuhq_user');
      localStorage.removeItem('giasuhq_remember_me');
    }
  },

  // Đăng ký tài khoản mới
  async register(data, rememberMe = true) {
    const response = await api.post('/auth/register', data);
    if (response.data?.data?.token) {
      this.saveSession(response.data.data.token, response.data.data.user, rememberMe);
    }
    return response.data;
  },

  // Đăng nhập
  async login(credentials, rememberMe = true) {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.data?.token) {
      this.saveSession(response.data.data.token, response.data.data.user, rememberMe);
    }
    return response.data;
  },

  // Đăng nhập bằng Google
  async loginWithGoogle({ idToken, role }, rememberMe = true) {
    const response = await api.post('/auth/google', { idToken, role });
    if (response.data?.data?.token) {
      this.saveSession(response.data.data.token, response.data.data.user, rememberMe);
    }
    return response.data;
  },

  // Lấy thông tin user hiện tại từ Token
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    if (response.data?.data) {
      const isRemember = localStorage.getItem('giasuhq_remember_me') === 'true';
      if (isRemember) {
        localStorage.setItem('giasuhq_user', JSON.stringify(response.data.data));
      } else {
        sessionStorage.setItem('giasuhq_user', JSON.stringify(response.data.data));
      }
    }
    return response.data;
  },

  // Đăng xuất hoàn toàn
  logout() {
    localStorage.removeItem('giasuhq_token');
    localStorage.removeItem('giasuhq_user');
    localStorage.removeItem('giasuhq_remember_me');
    sessionStorage.removeItem('giasuhq_token');
    sessionStorage.removeItem('giasuhq_user');
  },

  // Lấy user đã lưu
  getSavedUser() {
    const userStr = localStorage.getItem('giasuhq_user') || sessionStorage.getItem('giasuhq_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  // Lấy token
  getToken() {
    return localStorage.getItem('giasuhq_token') || sessionStorage.getItem('giasuhq_token');
  },

  // Lấy email đã ghi nhớ
  getRememberedEmail() {
    return localStorage.getItem('giasuhq_remember_email') || '';
  },

  // Kiểm tra cờ ghi nhớ
  isRemembered() {
    return localStorage.getItem('giasuhq_remember_me') === 'true';
  },

  isTutorOrAdmin(role) {
    return role === 'TUTOR' || role === 'ADMIN';
  },

  getDefaultViewForRole(role) {
    return this.isTutorOrAdmin(role) ? 'dashboard' : 'classes';
  },

  getAllowedViews(role) {
    if (role === 'ADMIN') {
      return ['dashboard', 'classes', 'assignments', 'materials', 'schedule', 'profile', 'payment', 'vip', 'tutors', 'checkout'];
    }
    if (role === 'TUTOR') {
      return ['dashboard', 'classes', 'assignments', 'materials', 'schedule', 'profile'];
    }
    if (role === 'PARENT') {
      return ['tutors', 'classes', 'payment', 'materials', 'assignments', 'vip', 'checkout'];
    }
    return ['tutors', 'classes', 'materials', 'vip', 'assignments', 'checkout'];
  },

  // Đăng ký: Gửi OTP xác thực về Gmail
  async sendRegisterOtp(email, fullName = '') {
    const response = await api.post('/auth/send-register-otp', { email, fullName });
    return response.data;
  },

  // Quên mật khẩu: Gửi OTP về Gmail
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Xác thực mã OTP
  async verifyOtp(email, otp) {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  // Đặt lại mật khẩu mới
  async resetPassword(email, otp, newPassword) {
    const response = await api.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  }
};
