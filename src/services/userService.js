import api from './api';

export const userService = {
  // Lấy Profile người dùng hiện tại
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Cập nhật Profile
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Lấy tất cả người dùng cho Admin
  async getAllUsersForAdmin() {
    const response = await api.get('/users/admin/all');
    return response.data;
  }
};

export default userService;
