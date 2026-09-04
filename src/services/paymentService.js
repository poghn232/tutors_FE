import api from './api';

export const paymentService = {
  // Lấy tổng quan học phí và hóa đơn
  async getPaymentOverview() {
    const response = await api.get('/payments');
    return response.data;
  },

  // Thanh toán thử nghiệm
  async checkout(invoiceId) {
    const response = await api.post(`/payments/checkout?invoiceId=${invoiceId}`);
    return response.data;
  }
};
