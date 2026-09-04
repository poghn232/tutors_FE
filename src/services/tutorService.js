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
  }
};
