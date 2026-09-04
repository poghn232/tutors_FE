import api from './api';

export const subjectService = {
  // Lấy danh sách tất cả các môn học
  async getSubjects() {
    const response = await api.get('/subjects');
    return response.data;
  },

  // Tạo môn học mới
  async createSubject(data) {
    const response = await api.post('/subjects', data);
    return response.data;
  }
};
