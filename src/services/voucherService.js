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
  }
};

export default voucherService;
