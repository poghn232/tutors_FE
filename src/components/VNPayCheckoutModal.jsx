import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  CreditCard, 
  Sparkles, 
  ExternalLink, 
  Info, 
  Copy, 
  CheckCheck, 
  Loader2, 
  QrCode, 
  ArrowRight,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import paymentService from '../services/paymentService';

export default function VNPayCheckoutModal({ isOpen, onClose, initialPlan = 'yearly', invoice = null }) {
  const methodTab = 'vietqr';
  const [selectedPlan, setSelectedPlan] = useState(initialPlan); // 'monthly', 'yearly', or 'invoice'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [orderCode, setOrderCode] = useState(() => 'TUTORA' + Math.floor(100000 + Math.random() * 900000));
  const [isPaid, setIsPaid] = useState(false);
  const [paidData, setPaidData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown

  // MB Bank Config from User
  const BANK_CONFIG = {
    bankId: 'MB',
    bankName: 'MB Bank (Ngân hàng Quân Đội)',
    accountNumber: '0913511637',
    accountName: 'PHAM GIA PHONG'
  };

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

  // Official VietQR URL standard Napas 247
  const vietQrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNumber}-compact2.png?amount=${currentPrice}&addInfo=${orderCode}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;

  // Polling check SePay webhook status
  useEffect(() => {
    if (!isOpen || isPaid || methodTab !== 'vietqr') return;

    const interval = setInterval(async () => {
      try {
        const res = await paymentService.checkSepayStatus(orderCode);
        if (res && res.data && res.data.paid) {
          setIsPaid(true);
          setPaidData(res.data);
          clearInterval(interval);
          // Redirect to success screen after 2s
          setTimeout(() => {
            const redirectUrl = `/#payment-result?vnp_Amount=${currentPrice * 100}&vnp_ResponseCode=00&vnp_TxnRef=${orderCode}&vnp_BankCode=MBBank&vnp_OrderInfo=${encodeURIComponent(orderTitle)}&vnp_TransactionNo=${res.data.referenceCode || 'MB_' + Date.now()}`;
            window.location.href = redirectUrl;
          }, 2000);
        }
      } catch (err) {
        // silent polling error
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen, isPaid, methodTab, orderCode, currentPrice, orderTitle]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isPaid || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isPaid, timeLeft]);

  if (!isOpen) return null;

  const handleCopy = (text, fieldName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num) + 'đ';
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRegenerateQR = () => {
    setOrderCode('TUTORA' + Math.floor(100000 + Math.random() * 900000));
    setTimeLeft(600);
    setError('');
  };

  const handleManualCheck = async () => {
    setLoading(true);
    try {
      const res = await paymentService.checkSepayStatus(orderCode);
      if (res && res.data && res.data.paid) {
        setIsPaid(true);
        setPaidData(res.data);
        setTimeout(() => {
          window.location.href = `/#payment-result?vnp_Amount=${currentPrice * 100}&vnp_ResponseCode=00&vnp_TxnRef=${orderCode}&vnp_BankCode=MBBank&vnp_OrderInfo=${encodeURIComponent(orderTitle)}`;
        }, 1500);
      } else {
        alert('Hệ thống đang chờ ngân hàng xác nhận giao dịch. Vui lòng hoàn tất chuyển khoản và chờ trong giây lát.');
      }
    } catch (e) {
      alert('Chưa nhận được giao dịch. Vui lòng quét mã QR chuyển tiền đúng cú pháp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
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
        maxWidth: '580px',
        width: '100%',
        padding: '28px',
        boxShadow: '8px 8px 0px #0f172a',
        position: 'relative',
        maxHeight: '92vh',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
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
            <QrCode size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
              {isInvoicePayment ? 'Thanh toán Học phí Tutora' : 'Nâng cấp Tài khoản VIP'}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
              Quét mã VietQR MB Bank tự động duyệt tiền 24/7 qua SePay
            </div>
          </div>
        </div>

        {/* Reassurance Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: '12px',
          padding: '10px 16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={18} color="#15803d" />
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#166534' }}>
              Chuyển khoản VietQR Napas 24/7 · MB Bank
            </span>
          </div>
          <span style={{
            background: '#dcfce7',
            color: '#15803d',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '999px',
            border: '1px solid #bbf7d0'
          }}>
            Tự động kích hoạt
          </span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {Object.values(plans).map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{
                    border: isSelected ? '2px solid #0f172a' : '1.5px solid #cbd5e1',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: isSelected ? '#f8fafc' : '#ffffff',
                    position: 'relative',
                    boxShadow: isSelected ? '2px 2px 0px #0f172a' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.popular && (
                    <span style={{
                      position: 'absolute',
                      top: '-9px',
                      right: '14px',
                      background: '#ff5f38',
                      color: '#ffffff',
                      borderRadius: '999px',
                      padding: '2px 8px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      border: '1px solid #0f172a'
                    }}>
                      TIẾT KIỆM 60%
                    </span>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '2px solid #0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isSelected ? '#0f172a' : '#ffffff'
                      }}>
                        {isSelected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />}
                      </div>
                      {p.name}
                    </div>

                    <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#059669' }}>
                      {p.priceFormatted}
                    </div>
                  </div>
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
            padding: '14px 18px',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Hóa đơn học phí:</div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginTop: '2px' }}>
              {invoice.className}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Kỳ học: {invoice.period}</span>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#ea580c' }}>
                {formatVND(currentPrice)}
              </span>
            </div>
          </div>
        )}

        {/* TAB 1: VIETQR MB BANK (SEPAY REAL MONEY) */}
        {methodTab === 'vietqr' && (
          <div>
            {isPaid ? (
              <div style={{
                background: '#ecfdf5',
                border: '2px solid #059669',
                borderRadius: '16px',
                padding: '32px 20px',
                textAlign: 'center',
                boxShadow: '4px 4px 0px #059669',
                margin: '10px 0 20px'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <Check size={32} strokeWidth={3} />
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 900, color: '#065f46' }}>
                  Thanh toán thành công!
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#047857' }}>
                  Tiền đã được chuyển vào tài khoản <b>MB Bank</b> của <b>{BANK_CONFIG.accountName}</b>.
                </p>
                <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#065f46' }}>
                  Đang chuyển hướng đến biên lai đơn hàng...
                </div>
              </div>
            ) : timeLeft <= 0 ? (
              /* TIMEOUT EXPIRED NOTIFICATION */
              <div style={{
                background: '#fff1f2',
                border: '2px solid #e11d48',
                borderRadius: '18px',
                padding: '24px 20px',
                textAlign: 'center',
                marginBottom: '16px',
                boxShadow: '3px 3px 0px #0f172a'
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#ffe4e6',
                  color: '#e11d48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto'
                }}>
                  <AlertTriangle size={28} />
                </div>

                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 900, color: '#9f1239' }}>
                  Phiên thanh toán đã hết hạn!
                </h3>

                <p style={{ margin: '0 0 16px 0', fontSize: '0.86rem', color: '#881337', lineHeight: 1.5 }}>
                  Mã QR thanh toán cho đơn hàng <b>{orderCode}</b> đã hết hạn sau 10 phút để bảo vệ thông tin giao dịch.
                  <br />
                  • <b>Nếu bạn đã chuyển khoản:</b> Vui lòng bấm <i>"Kiểm tra lại giao dịch"</i> hoặc giữ lại ảnh biên lai ngân hàng để nhân viên hỗ trợ kích hoạt.
                  <br />
                  • <b>Nếu bạn chưa chuyển khoản:</b> Vui lòng bấm <i>"Tạo mã QR mới"</i> để gia hạn thêm 10 phút.
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleRegenerateQR}
                    style={{
                      background: '#7c3aed',
                      color: '#ffffff',
                      border: '2px solid #0f172a',
                      boxShadow: '2px 2px 0px #0f172a',
                      borderRadius: '10px',
                      padding: '10px 18px',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCw size={16} /> Tạo mã QR mới (Gia hạn 10 phút)
                  </button>

                  <button
                    type="button"
                    onClick={handleManualCheck}
                    disabled={loading}
                    style={{
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '2px solid #0f172a',
                      boxShadow: '2px 2px 0px #0f172a',
                      borderRadius: '10px',
                      padding: '10px 18px',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    {loading ? 'Đang kiểm tra...' : 'Kiểm tra lại giao dịch'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* QR Code and Bank Details Box */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  gap: '18px',
                  background: '#f8fafc',
                  border: '1.5px solid #0f172a',
                  borderRadius: '18px',
                  padding: '16px',
                  marginBottom: '16px',
                  alignItems: 'center'
                }}>
                  {/* Left: QR Image */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}>
                      <img 
                        src={vietQrUrl} 
                        alt="VietQR MB Bank" 
                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} 
                      />
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      color: '#64748b',
                      marginTop: '6px',
                      fontWeight: 700
                    }}>
                      <Clock size={12} /> Hết hạn: <span style={{ color: '#ef4444' }}>{formatTimer(timeLeft)}</span>
                    </div>
                  </div>

                  {/* Right: Transfer Info Fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Ngân hàng */}
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                        Ngân hàng thụ hưởng
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#005baa' }}>
                        MB Bank · Quân Đội
                      </div>
                    </div>

                    {/* Số tài khoản */}
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                        Số tài khoản
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0f172a', letterSpacing: '0.5px' }}>
                          {BANK_CONFIG.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(BANK_CONFIG.accountNumber, 'acc')}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '6px',
                            padding: '2px 6px',
                            cursor: 'pointer',
                            color: '#1d4ed8',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          {copiedField === 'acc' ? <CheckCheck size={12} /> : <Copy size={12} />}
                          {copiedField === 'acc' ? 'Đã chép' : 'Chép'}
                        </button>
                      </div>
                    </div>

                    {/* Chủ tài khoản */}
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                        Chủ tài khoản
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                        {BANK_CONFIG.accountName}
                      </div>
                    </div>

                    {/* Số tiền */}
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                        Số tiền cần chuyển
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#059669' }}>
                          {formatVND(currentPrice)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentPrice.toString(), 'amount')}
                          style={{
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            borderRadius: '6px',
                            padding: '2px 6px',
                            cursor: 'pointer',
                            color: '#047857',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          {copiedField === 'amount' ? <CheckCheck size={12} /> : <Copy size={12} />}
                          {copiedField === 'amount' ? 'Đã chép' : 'Chép'}
                        </button>
                      </div>
                    </div>

                    {/* Cú pháp chuyển khoản */}
                    <div style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '8px',
                      padding: '6px 10px'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: '#92400e', fontWeight: 800, textTransform: 'uppercase' }}>
                        Nội dung chuyển khoản (bắt buộc)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                        <span style={{ fontWeight: 900, fontSize: '1rem', color: '#b45309', fontFamily: 'monospace' }}>
                          {orderCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(orderCode, 'content')}
                          style={{
                            background: '#fef3c7',
                            border: '1px solid #fcd34d',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            cursor: 'pointer',
                            color: '#b45309',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          {copiedField === 'content' ? <CheckCheck size={12} /> : <Copy size={12} />}
                          {copiedField === 'content' ? 'Đã chép' : 'Chép'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Waiting indicator with Radar Pulse */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  marginBottom: '18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.2)',
                      animation: 'pulse 1.5s infinite'
                    }} />
                    <span style={{ fontSize: '0.84rem', color: '#15803d', fontWeight: 700 }}>
                      Hệ thống tự động kích hoạt ngay khi nhận tiền
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualCheck}
                    disabled={loading}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #86efac',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#15803d',
                      cursor: 'pointer'
                    }}
                  >
                    {loading ? 'Đang kiểm tra...' : 'Kiểm tra ngay'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: '#64748b',
          marginTop: '16px'
        }}>
          <ShieldCheck size={16} color="#059669" />
          Giao dịch được bảo mật bởi SePay Webhook & Cổng thanh toán quốc gia
        </div>

      </div>
    </div>
  );
}
