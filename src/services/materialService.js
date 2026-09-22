import api from './api';

export const materialService = {
  /**
   * Lấy danh sách tài liệu từ backend (hỗ trợ filter môn học, định dạng, tìm kiếm)
   */
  async getMaterials(params = {}) {
    const response = await api.get('/materials', { params });
    return response.data;
  },

  /**
   * Lấy chi tiết 1 tài liệu theo ID
   */
  async getMaterialById(id) {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },

  /**
   * Thêm tài liệu học tập mới (Admin / Tutor)
   */
  async createMaterial(data) {
    const response = await api.post('/materials', data);
    return response.data;
  },

  /**
   * Cập nhật tài liệu học tập (Admin / Tutor)
   */
  async updateMaterial(id, data) {
    const response = await api.put(`/materials/${id}`, data);
    return response.data;
  },

  /**
   * Xóa tài liệu học tập (Admin / Tutor)
   */
  async deleteMaterial(id) {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
  },

  /**
   * Tăng số lượt tải của tài liệu
   */
  async incrementDownload(id) {
    try {
      const response = await api.post(`/materials/${id}/download`);
      return response.data;
    } catch (e) {
      console.warn('Cannot increment download count:', e.message);
      return null;
    }
  }
};

export default materialService;
