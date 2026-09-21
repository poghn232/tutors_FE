import React, { useEffect, useState } from 'react';
import { CreditCard, WalletCards, Plus, Info, CheckCircle2 } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const formatVND = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
    .format(Number(value || 0));

export default function PaymentView() {
  const { user, updateUser } = useAuth();
  const [overview, setOverview] = useState(null);
  const [amount, setAmount] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const balance = user?.balance ?? overview?.totalPaidFee ?? 0;

  useEffect(() => {
    async function loadPayment() {
      const res = await paymentService.getPaymentOverview();
      if (res?.success) {
        setOverview(res.data);
      }
    }
    loadPayment();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await paymentService.depositBalance(Number(amount));
    setLoading(false);
    if (res?.success) {
      updateUser({ balance: res.data.balance });
      setMessage('Nạp số dư kết nối thành công.');
    } else {
      setMessage(res?.message || 'Không thể nạp số dư.');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 20px 48px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', fontFamily: 'serif' }}>
          Ví kết nối
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
          Nạp số dư để thanh toán phí kết nối sau khi gia sư chấp nhận lịch học.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <div style={{ background: '#181c2e', color: '#fff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '24px' }}>
          <WalletCards size={24} color="#ffd600" />
          <div style={{ marginTop: '14px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Số dư khả dụng
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffd600', marginTop: '6px', fontFamily: 'serif' }}>
            {formatVND(balance)}
          </div>
        </div>

        <div style={{ background: '#eafaf3', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '24px' }}>
          <CreditCard size={24} color="#059669" />
          <div style={{ marginTop: '14px', color: '#64748b', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Phí kết nối mặc định (Thử nghiệm)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', marginTop: '6px', fontFamily: 'serif' }}>
            {formatVND(5000)}
          </div>
          <p style={{ margin: '6px 0 0', color: '#475569', fontSize: '0.86rem' }}>
            Chỉ thu khi gia sư đã đồng ý lịch học.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 360px)', gap: '22px', alignItems: 'start' }}>
        <section style={{ background: '#ffffff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 14px', color: '#0f172a', fontSize: '1.05rem', fontWeight: 900 }}>
            Nguyên tắc thanh toán
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#334155', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Info size={18} color="#2563eb" />
              <span>Hệ thống là nền tảng kết nối, không giữ hoặc chia học phí giữa phụ huynh/học sinh và gia sư.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <CheckCircle2 size={18} color="#059669" />
              <span>Phụ huynh/học sinh gửi yêu cầu, gia sư chấp nhận lịch, sau đó mới thanh toán phí kết nối để kích hoạt lớp.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <CheckCircle2 size={18} color="#059669" />
              <span>Gia sư không có luồng rút tiền trong hệ thống này.</span>
            </div>
          </div>
        </section>

        <form onSubmit={handleDeposit} style={{ background: '#ffffff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 14px', color: '#0f172a', fontSize: '1.05rem', fontWeight: 900 }}>
            Nạp số dư
          </h3>
          <label style={{ display: 'block', color: '#0f172a', fontWeight: 800, fontSize: '0.88rem', marginBottom: '8px' }}>
            Số tiền
          </label>
          <input
            type="number"
            min="5000"
            step="5000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #0f172a', borderRadius: '12px', padding: '12px 14px', fontWeight: 800, fontSize: '1rem' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="figma-btn-primary"
            style={{ width: '100%', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Plus size={18} /> {loading ? 'Đang nạp...' : 'Nạp vào ví'}
          </button>
          {message && <p style={{ margin: '12px 0 0', color: message.includes('thành công') ? '#059669' : '#dc2626', fontWeight: 700, fontSize: '0.86rem' }}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
