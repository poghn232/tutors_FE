import api from './api';

export const paymentService = {
  /**
   * Request VNPay payment URL from backend
   * @param {Object} data - { amount: number, orderInfo: string, orderType: string, bankCode?: string, invoiceId?: number }
   * @returns {Promise<{success: boolean, data: {paymentUrl: string, txnRef: string, amount: number, orderInfo: string}}>}
   */
  async createVNPayPayment(data) {
    try {
      const payload = {
        ...data,
        returnUrl: data?.returnUrl || `${window.location.origin}/#payment-result`
      };
      const response = await api.post('/payments/vnpay/create-payment', payload);
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      }
      return {
        success: false,
        message: response.data?.message || 'Không thể khởi tạo giao dịch VNPay'
      };
    } catch (error) {
      console.error('Error creating VNPay payment:', error);
      // Fallback for local preview if backend is starting
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi kết nối đến máy chủ thanh toán.'
      };
    }
  },

  /**
   * Verify VNPay Callback result
   * @param {Object} queryParams 
   */
  async verifyVNPayCallback(queryParams) {
    try {
      const response = await api.get('/payments/vnpay/callback', {
        params: queryParams
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying VNPay callback:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi xác thực giao dịch từ máy chủ.'
      };
    }
  },

  /**
   * Get tuition payment invoices
   */
  async getPaymentOverview() {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return null;
    }
  },

  /**
   * Check SePay payment status for an order
   * @param {string} orderCode
   */
  async checkSepayStatus(orderCode) {
    try {
      const response = await api.get('/payments/sepay/check-status', {
        params: { orderCode }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking SePay status:', error);
      return { success: false, data: { paid: false } };
    }
  }
};

export default paymentService;
