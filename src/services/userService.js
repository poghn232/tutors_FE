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
  }
};
