import React, { useState } from 'react';
import { X, ShieldCheck, Check, CreditCard, Sparkles, ExternalLink, Info } from 'lucide-react';
import paymentService from '../services/paymentService';

export default function VNPayCheckoutModal({ isOpen, onClose, initialPlan = 'yearly', invoice = null }) {
  const [selectedPlan, setSelectedPlan] = useState(initialPlan); // 'monthly', 'yearly', or 'invoice'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const plans = {
    monthly: {
      id: 'monthly',
      name: 'Gói VIP 1 Tháng',
      price: 99000,
      priceFormatted: '99.000 đ',
      period: '/ tháng',
      desc: 'Truy cập không giới hạn 200+ tài liệu chuyên sâu trong 30 ngày.',
      popular: false
    },
    yearly: {
      id: 'yearly',
      name: 'Gói VIP 1 Năm (Khuyên dùng)',
      price: 299000,
      priceFormatted: '299.000 đ',
      period: '/ năm',
      desc: 'Tiết kiệm 60% học phí tài liệu, tặng trọn bộ đề thi thử THPT có video giải chi tiết.',
      popular: true
    }
  };

  const isInvoicePayment = !!invoice;
  const currentPrice = isInvoicePayment ? (invoice.amount || 1200000) : plans[selectedPlan].price;
  const orderTitle = isInvoicePayment 
    ? `Thanh toan hoc phi ${invoice.className || 'lop hoc'}` 
    : `Nang cap ${plans[selectedPlan].name}`;

  const handleVNPayCheckout = async () => {
    try {
      setLoading(true);
      setError('');

      const paymentData = {
        amount: currentPrice,
        orderInfo: orderTitle,
        orderType: isInvoicePayment ? 'billpayment' : 'other',
        invoiceId: invoice?.id || null,
        planId: isInvoicePayment ? null : selectedPlan
      };

      const res = await paymentService.createVNPayPayment(paymentData);
      if (res && res.success && res.data?.paymentUrl) {
        // Redirect browser directly to VNPay Sandbox
        window.location.href = res.data.paymentUrl;
      } else {
        setError(res?.message || 'Không thể tạo phiên thanh toán VNPay. Vui lòng thử lại.');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối máy chủ thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '2.5px solid #0f172a',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        padding: '32px',
        boxShadow: '8px 8px 0px #0f172a',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: '#005baa',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.2rem',
            border: '2px solid #0f172a'
          }}>
            V
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
              {isInvoicePayment ? 'Thanh toán Học phí qua VNPAY' : 'Nâng cấp Gói VIP qua VNPAY'}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
              Cổng thanh toán quốc gia VNPay (Sandbox Thử nghiệm)
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #f87171',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#b91c1c',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Plan Selection (if VIP upgrade) */}
        {!isInvoicePayment ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {Object.values(plans).map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{
                    border: isSelected ? '2px solid #0f172a' : '1.5px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    background: isSelected ? '#f8fafc' : '#ffffff',
                    position: 'relative',
                    boxShadow: isSelected ? '3px 3px 0px #0f172a' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.popular && (
                    <span style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '16px',
                      background: '#ff5f38',
                      color: '#ffffff',
                      borderRadius: '999px',
                      padding: '2px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      border: '1px solid #0f172a'
                    }}>
                      TIẾT KIỆM 60%
                    </span>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: '2px solid #0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isSelected ? '#0f172a' : '#ffffff'
                      }}>
                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />}
                      </div>
                      {p.name}
                    </div>

                    <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#059669' }}>
                      {p.priceFormatted}
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', paddingLeft: '26px', lineHeight: 1.4 }}>
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Invoice Detail Card */
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #0f172a',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Hóa đơn học phí:</div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginTop: '2px' }}>
              {invoice.className}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Kỳ học: {invoice.period}</span>
              <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ea580c' }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPrice)}
              </span>
            </div>
          </div>
        )}

        {/* Sandbox Test Card Credentials Callout */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '14px',
          padding: '14px 18px',
          marginBottom: '24px',
          fontSize: '0.82rem',
          color: '#1e40af',
          lineHeight: 1.5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '6px' }}>
            <Info size={16} /> Thông tin thẻ thử nghiệm VNPay Sandbox:
          </div>
          <div>• <b>Ngân hàng:</b> NCB</div>
          <div>• <b>Số thẻ:</b> 9704198526191432198</div>
          <div>• <b>Tên chủ thẻ:</b> NGUYEN VAN A | <b>Ngày phát hành:</b> 07/15</div>
          <div>• <b>Mã OTP:</b> 123456</div>
        </div>

        {/* Checkout Button */}
        <button
          type="button"
          onClick={handleVNPayCheckout}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#005baa',
            color: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '14px',
            padding: '14px',
            fontWeight: 900,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '3px 3px 0px #0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          {loading ? (
            <span>Đang chuyển sang cổng VNPay...</span>
          ) : (
            <>
              <span>Thanh toán {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPrice)} qua VNPAY</span>
              <ExternalLink size={18} />
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', color: '#64748b', fontSize: '0.78rem' }}>
          <ShieldCheck size={14} color="#059669" />
          <span>Bảo mật 256-bit SSL chuẩn VNPay Sandbox 2.1.0</span>
        </div>
      </div>
    </div>
  );
}
