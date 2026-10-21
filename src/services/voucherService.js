import api from './api';

export const voucherService = {
  async getMyVouchers() {
    const response = await api.get('/vouchers');
    return response.data;
  },

  async claim(code) {
    const response = await api.post('/vouchers/claim', { code });
    return response.data;
  },

  async quote(code, amount) {
    const response = await api.post('/vouchers/quote', { code, amount });
    return response.data;
  },

  async share(userVoucherId) {
    const response = await api.post(`/vouchers/${userVoucherId}/share`);
    return response.data;
  },

  // Admin endpoints
  async getAllVouchersForAdmin() {
    const response = await api.get('/vouchers/admin/all');
    return response.data;
  },

  async createVoucher(data) {
    const response = await api.post('/vouchers/admin', data);
    return response.data;
  },

  async toggleVoucherStatus(id) {
    const response = await api.put(`/vouchers/admin/${id}/toggle-status`);
    return response.data;
  },

  async deleteVoucher(id) {
    const response = await api.delete(`/vouchers/admin/${id}`);
    return response.data;
  },

  async issueVoucherToUser(userId, code) {
    const response = await api.post('/vouchers/admin/issue', { userId, code });
    return response.data;
  }
};

export default voucherService;
