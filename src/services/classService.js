import api from './api';

export const classService = {
  // Lấy danh sách lớp học của user đang đăng nhập
  async getClasses() {
    const response = await api.get('/classes');
    return response.data;
  },

  // Lấy chi tiết 1 lớp học
  async getClassById(id) {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  // Tạo lớp học mới
  async createClass(classData) {
    const response = await api.post('/classes', classData);
    return response.data;
  }
};
