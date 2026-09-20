import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, BookOpen, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import paymentService from '../services/paymentService';

export default function PaymentResultView({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [params, setParams] = useState({});

  useEffect(() => {
    // Parse query params from either window.location.search or window.location.hash
    let queryString = window.location.search;
    if (!queryString && window.location.hash.includes('?')) {
      queryString = window.location.hash.substring(window.location.hash.indexOf('?'));
    }

    const urlParams = new URLSearchParams(queryString);
    const paramObj = {};
    for (const [key, value] of urlParams.entries()) {
      paramObj[key] = value;
    }
    setParams(paramObj);

    const checkPayment = async () => {
      if (paramObj.vnp_ResponseCode) {
        const res = await paymentService.verifyVNPayCallback(paramObj);
        if (res && res.success && res.data) {
          setResult(res.data);
        } else {
          const isSuccess = paramObj.vnp_ResponseCode === '00';
          let amount = 0;
          try {
            amount = Long.parseLong(paramObj.vnp_Amount) / 100;
          } catch (e) {
            amount = parseInt(paramObj.vnp_Amount || '0') / 100;
          }
          setResult({
            success: isSuccess,
            responseCode: paramObj.vnp_ResponseCode,
            txnRef: paramObj.vnp_TxnRef,
            transactionNo: paramObj.vnp_TransactionNo,
            bankCode: paramObj.vnp_BankCode,
            amount: amount,
            orderInfo: decodeURIComponent(paramObj.vnp_OrderInfo || 'Thanh toán dịch vụ Tutora'),
            payDate: paramObj.vnp_PayDate,
            message: isSuccess ? 'Giao dịch thanh toán thành công qua VNPay!' : 'Giao dịch không thành công hoặc bị hủy.'
          });
        }
      } else {
        // Mock success preview if accessed directly for UI testing
        setResult({
          success: true,
          responseCode: '00',
          txnRef: 'TEST_' + Math.floor(100000 + Math.random() * 900000),
          transactionNo: '14829381',
          bankCode: 'NCB',
          amount: 299000,
          orderInfo: 'Nang cap goi VIP Tai lieu 1 nam',
          message: 'Giao dịch thanh toán thành công qua VNPay Sandbox!'
        });
      }
      setLoading(false);
    };

    checkPayment();
  }, []);

  const formatMoney = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const formatPayDate = (d) => {
    if (!d || d.length !== 14) return new Date().toLocaleString('vi-VN');
    // yyyyMMddHHmmss
    const year = d.substring(0, 4);
    const month = d.substring(4, 6);
    const day = d.substring(6, 8);
    const hour = d.substring(8, 10);
    const min = d.substring(10, 12);
    const sec = d.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${min}:${sec}`;
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '40px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px auto'
        }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Đang xác thực giao dịch với VNPay...</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Vui lòng đợi trong giây lát.</p>
      </div>
    );
  }

  const isSuccess = result?.success || result?.responseCode === '00';

  return (
    <div style={{ maxWidth: '680px', margin: '40px auto 80px', padding: '0 16px' }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '2.5px solid #0f172a',
        borderRadius: '24px',
        boxShadow: '6px 6px 0px #0f172a',
        padding: '40px 32px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Status Badge Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '22px',
          backgroundColor: isSuccess ? '#ecfdf5' : '#fef2f2',
          border: `2px solid ${isSuccess ? '#059669' : '#dc2626'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '3px 3px 0px #0f172a'
        }}>
          {isSuccess ? (
            <CheckCircle2 size={40} color="#059669" strokeWidth={2.5} />
          ) : (
            <XCircle size={40} color="#dc2626" strokeWidth={2.5} />
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.6rem',
          fontWeight: 900,
          color: isSuccess ? '#059669' : '#dc2626',
          margin: '0 0 8px 0'
        }}>
          {isSuccess ? 'THANH TOÁN THÀNH CÔNG!' : 'GIAO DỊCH THẤT BÀI'}
        </h1>

        <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 28px 0', lineHeight: 1.5 }}>
          {result?.message || (isSuccess ? 'Cảm ơn bạn đã tin tưởng dịch vụ của Tutora.' : 'Giao dịch qua cổng VNPay chưa được hoàn tất.')}
        </p>

        {/* Transaction Details Box */}
        <div style={{
          background: '#f8fafc',
          border: '1.5px solid #cbd5e1',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>
            <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Số tiền thanh toán:</span>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', color: isSuccess ? '#059669' : '#0f172a' }}>
              {formatMoney(result?.amount)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>
            <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Nội dung đơn hàng:</span>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', textAlign: 'right', maxWidth: '60%' }}>
              {result?.orderInfo || 'Thanh toán Tutora'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>
            <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Mã tham chiếu đơn (TxnRef):</span>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', fontFamily: 'monospace' }}>
              #{result?.txnRef || 'N/A'}
            </span>
          </div>

          {result?.transactionNo && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Mã giao dịch VNPay:</span>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', fontFamily: 'monospace' }}>
                {result.transactionNo}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>
            <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Ngân hàng thanh toán:</span>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2563eb' }}>
              {result?.bankCode || 'VNPAY'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Thời gian:</span>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}>
              {formatPayDate(result?.payDate)}
            </span>
          </div>
        </div>

        {/* Success Feature Activation Alert */}
        {isSuccess && (
          <div style={{
            background: '#fff4cc',
            border: '1.5px solid #0f172a',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '28px',
            textAlign: 'left'
          }}>
            <ShieldCheck size={24} color="#059669" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600, lineHeight: 1.4 }}>
              Hệ thống đã tự động kích hoạt quyền lợi gói dịch vụ cho tài khoản của bạn. Bạn có thể sử dụng ngay bây giờ!
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onNavigate('materials')}
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: '2px solid #0f172a',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #0f172a',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BookOpen size={18} />
            <span>Xem Kho Tài Liệu</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: '2px solid #0f172a',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #0f172a',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} />
            <span>Về Trang Chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
