import api from './api';

export const tutorService = {
  // Lấy danh sách tất cả Gia sư
  async getTutors() {
    const response = await api.get('/tutors');
    return response.data;
  },

  // Lấy chi tiết 1 Gia sư
  async getTutorById(id) {
    const response = await api.get(`/tutors/${id}`);
    return response.data;
  },

  // Lấy danh sách Gia sư cho Admin (kèm trạng thái xác thực và bằng cấp)
  async getAdminTutors() {
    const response = await api.get('/tutors/admin/all');
    return response.data;
  },

  // Admin cập nhật trạng thái kiểm duyệt gia sư (APPROVED / REJECTED)
  async updateTutorVerification(id, status, reason = '') {
    const response = await api.put(`/tutors/${id}/verification`, { status, reason });
    return response.data;
  }
};
