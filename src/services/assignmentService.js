import api from './api';

export const assignmentService = {
  /**
   * Lấy danh sách bài tập của người dùng hiện tại
   */
  async getAssignments() {
    try {
      const response = await api.get('/assignments');
      return response.data;
    } catch (error) {
      console.warn('Backend getAssignments warning, returning error or fallback:', error);
      throw error;
    }
  },

  /**
   * Tìm kiếm danh sách phụ huynh theo từ khóa (email, tên, tên học sinh)
   */
  async searchParents(query = '') {
    try {
      const response = await api.get(`/assignments/parents/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.warn('Backend searchParents warning:', error);
      return { success: false, data: [] };
    }
  },

  /**
   * Lấy chi tiết bài tập theo ID
   */
  async getAssignmentById(id) {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  /**
   * Gia sư tạo bài tập mới
   */
  async createAssignment(data) {
    const response = await api.post('/assignments', data);
    return response.data;
  },

  /**
   * Phụ huynh nộp bài tập
   */
  async submitAssignment(assignmentId, data) {
    const response = await api.post(`/assignments/${assignmentId}/submit`, data);
    return response.data;
  },

  /**
   * Gia sư chấm điểm (Rating 0-10) và nhận xét bài tập
   */
  async gradeAssignment(assignmentId, data) {
    const response = await api.post(`/assignments/${assignmentId}/grade`, data);
    return response.data;
  }
};

export default assignmentService;
