import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import { CreditCard, ShieldAlert, CheckCircle, Clock, ExternalLink, ArrowRight, DollarSign } from 'lucide-react';

export default function PaymentView() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutMsg, setCheckoutMsg] = useState('');

  useEffect(() => {
    async function loadPayment() {
      try {
        setLoading(true);
        const res = await paymentService.getPaymentOverview();
        if (res.success) {
          setOverview(res.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu học phí:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayment();
  }, []);

  const handleCheckout = async (invoiceId) => {
    try {
      const res = await paymentService.checkout(invoiceId);
      if (res.success) {
        setCheckoutMsg(res.data || res.message);
      }
    } catch (err) {
      alert('Không thể thực hiện yêu cầu thanh toán.');
    }
  };

  const formatVND = (val) => {
    if (!val) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu học phí & hóa đơn...</div>;
  }

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Notice Banner about API Payment Integration */}
      <div className="card" style={{
        backgroundColor: '#fffbe5',
        borderLeft: '4px solid #f59e0b',
        marginBottom: '20px',
        padding: '16px 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <ShieldAlert size={24} style={{ color: '#d97706', shrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 4px 0', color: '#92400e', fontSize: '1rem' }}>
              Thông báo Kết nối Cổng Thanh toán API (VNPay / ZaloPay / MoMo)
            </h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#78350f', lineHeight: '1.5' }}>
              {overview?.gatewayNotice || 'Chức năng Thanh toán trực tuyến qua cổng API sẽ được tích hợp kết nối chính thức khi khởi chạy. Hiện tại hệ thống tự động ghi nhận và quản lý học phí.'}
            </p>
          </div>
        </div>
      </div>

      {checkoutMsg && <div className="alert alert-success">{checkoutMsg}</div>}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Học phí chờ thanh toán</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#d97706' }}>
            {formatVND(overview?.totalPendingFee)}
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Học phí đã quyết toán</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#059669' }}>
            {formatVND(overview?.totalPaidFee)}
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '14px' }}>Danh sách Hóa đơn & Học phí theo tháng</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {overview?.invoices?.map((inv) => (
          <div key={inv.id} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{inv.className}</strong>
                <span className="badge" style={{
                  backgroundColor: inv.status === 'PAID' ? '#dcfce7' : '#fef3c7',
                  color: inv.status === 'PAID' ? '#15803d' : '#b45309'
                }}>
                  {inv.status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Kỳ học: {inv.period} • Hạn thanh toán: {inv.dueDate}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#0f172a' }}>
                {formatVND(inv.amount)}
              </span>

              {inv.status === 'PENDING' && (
                <button
                  onClick={() => handleCheckout(inv.id)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '6px 12px', gap: '4px' }}
                >
                  Thanh toán ngay <ExternalLink size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
