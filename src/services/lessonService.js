import api from './api';

export const lessonService = {
  // Lấy danh sách buổi học của user đang đăng nhập
  async getLessons() {
    const response = await api.get('/lessons');
    return response.data;
  },

  // Tạo buổi học mới (Gia sư)
  async createLesson(lessonData) {
    const response = await api.post('/lessons', lessonData);
    return response.data;
  },

  // Cập nhật trạng thái buổi học (SCHEDULED, COMPLETED, CANCELLED)
  async updateLessonStatus(lessonId, status) {
    const response = await api.patch(`/lessons/${lessonId}/status`, { status });
    return response.data;
  },

  // Thêm hoặc cập nhật ghi chú buổi học & AI Note
  async saveLessonNote(lessonId, noteData) {
    const response = await api.post(`/lessons/${lessonId}/note`, noteData);
    return response.data;
  },

  // Gọi Gemini AI gợi ý bản tóm tắt sư phạm từ ghi chú thô của gia sư
  async suggestAiNote(lessonId, rawNote) {
    const response = await api.post(`/lessons/${lessonId}/ai-note-suggest`, { rawNote });
    return response.data;
  }
};

