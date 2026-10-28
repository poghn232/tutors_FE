import api from './api';

export const tutorPostService = {
  // Lấy danh sách bài đăng công khai (Bảng tin tìm lớp mới)
  async getPublicPosts(params = {}) {
    const response = await api.get('/tutor-posts', { params });
    return response.data;
  },

  // Lấy chi tiết bài đăng
  async getPostById(id) {
    const response = await api.get(`/tutor-posts/${id}`);
    return response.data;
  },

  // Tạo bài đăng tìm gia sư mới (Phụ huynh / Học sinh)
  async createPost(postData) {
    const response = await api.post('/tutor-posts', postData);
    return response.data;
  },

  // Cập nhật bài đăng
  async updatePost(id, postData) {
    const response = await api.put(`/tutor-posts/${id}`, postData);
    return response.data;
  },

  // Đóng/hủy bài đăng
  async closePost(id) {
    const response = await api.patch(`/tutor-posts/${id}/status`);
    return response.data;
  },

  // Lấy danh sách bài đăng của user hiện tại
  async getMyPosts() {
    const response = await api.get('/tutor-posts/my-posts');
    return response.data;
  },

  // Lấy danh sách ứng viên đã nộp đơn vào bài đăng
  async getApplicationsForPost(postId) {
    const response = await api.get(`/tutor-posts/${postId}/applications`);
    return response.data;
  },

  // Gia sư nộp đơn ứng tuyển nhận lớp
  async applyToPost(postId, applicationData) {
    const response = await api.post(`/tutor-posts/${postId}/apply`, applicationData);
    return response.data;
  },

  // Gia sư xem các đơn ứng tuyển của mình
  async getMyApplications() {
    const response = await api.get('/tutor-posts/my-applications');
    return response.data;
  },

  // Phụ huynh duyệt chấp nhận gia sư -> tự động tạo lớp TutoringClass
  async acceptApplication(postId, applicationId) {
    const response = await api.post(`/tutor-posts/${postId}/applications/${applicationId}/accept`);
    return response.data;
  },

  // Phụ huynh từ chối ứng viên
  async rejectApplication(postId, applicationId, rejectionNote = '') {
    const response = await api.post(`/tutor-posts/${postId}/applications/${applicationId}/reject`, { rejectionNote });
    return response.data;
  },

  // Gia sư rút hồ sơ ứng tuyển
  async withdrawApplication(applicationId) {
    const response = await api.delete(`/tutor-posts/applications/${applicationId}`);
    return response.data;
  },

  // ADMIN: Lấy toàn bộ bài đăng
  async getAllPostsForAdmin(params = {}) {
    const response = await api.get('/admin/tutor-posts', { params });
    return response.data;
  },

  // ADMIN: Duyệt hoặc từ chối bài đăng
  async moderatePost(id, action, rejectionReason = '') {
    const response = await api.patch(`/admin/tutor-posts/${id}/moderate`, { action, rejectionReason });
    return response.data;
  }
};
