import React, { useEffect, useState } from 'react';
import { CheckCircle2, Copy, Gift, Link2, RefreshCw, Share2, TicketPercent } from 'lucide-react';
import voucherService from '../services/voucherService';

const formatVND = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function PromotionView() {
  const [vouchers, setVouchers] = useState([]);
  const [claimCode, setClaimCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherService.getMyVouchers();
      if (response?.success) setVouchers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải kho voucher.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
    const query = window.location.hash.split('?')[1];
    const params = new URLSearchParams(query || '');
    const sharedCode = params.get('claim') || window.sessionStorage.getItem('pendingVoucherClaim');
    if (sharedCode) setClaimCode(sharedCode);
  }, []);

  const handleClaim = async (event) => {
    event.preventDefault();
    if (!claimCode.trim()) return;
    try {
      setClaiming(true);
      setError('');
      const response = await voucherService.claim(claimCode.trim());
      if (response?.success) {
        setMessage(`Đã nhận voucher ${response.data?.code || ''}.`);
        setClaimCode('');
        window.sessionStorage.removeItem('pendingVoucherClaim');
        await loadVouchers();
      } else {
        setError(response?.message || 'Không thể nhận voucher.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể nhận voucher.');
    } finally {
      setClaiming(false);
    }
  };

  const shareVoucher = async (voucher) => {
    try {
      setError('');
      const response = await voucherService.share(voucher.id);
      if (!response?.success) throw new Error(response?.message || 'Không thể tạo link chia sẻ.');
      const shareUrl = `${window.location.origin}${response.data.shareUrl}`;
      await navigator.clipboard?.writeText(shareUrl);
      setMessage('Đã tạo và sao chép link chia sẻ voucher.');
      await loadVouchers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Không thể tạo link chia sẻ.');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 20px 60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}><Gift size={16} /> Ưu đãi</div>
        <h1 style={{ margin: '6px 0', fontSize: '2rem', fontWeight: 900, color: '#0f172a', fontFamily: 'serif' }}>Kho Voucher</h1>
        <p style={{ margin: 0, color: '#64748b' }}>Nhận voucher từ link chia sẻ, dùng ở bước thanh toán và nhận voucher cảm ơn sau khi thanh toán thành công.</p>
      </div>

      {message && <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', borderRadius: '12px', padding: '11px 14px', marginBottom: '14px', fontWeight: 700 }}>{message}</div>}
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '12px', padding: '11px 14px', marginBottom: '14px', fontWeight: 700 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '18px', alignItems: 'start' }}>
        <section style={{ background: '#fff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 900 }}>Voucher của tôi</h2>
            <button type="button" onClick={loadVouchers} title="Làm mới voucher" style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}><RefreshCw size={16} /></button>
          </div>
          {loading ? <div style={{ color: '#64748b', padding: '20px 0' }}>Đang tải voucher...</div> : vouchers.length === 0 ? <div style={{ color: '#64748b', padding: '20px 0' }}>Bạn chưa có voucher. Hãy nhập mã hoặc nhận link chia sẻ.</div> : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {vouchers.map((voucher) => (
                <div key={voucher.id} style={{ border: '1px solid #e2e8f0', borderRadius: '14px', padding: '15px 16px', display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff1ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><TicketPercent size={21} /></div>
                    <div>
                      <div style={{ color: '#0f172a', fontWeight: 900 }}>{voucher.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '3px' }}>{voucher.description || 'Ưu đãi dành cho bạn'}</div>
                      <div style={{ color: '#ea580c', fontWeight: 900, marginTop: '6px' }}>{voucher.code} · {voucher.discountType === 'PERCENTAGE' ? `${voucher.discountValue}%` : formatVND(voucher.discountValue)}</div>
                    </div>
                  </div>
                  {voucher.status === 'AVAILABLE' && voucher.shareable && (
                    <button type="button" onClick={() => shareVoucher(voucher)} className="figma-btn-outline" style={{ width: 'auto', padding: '8px 12px', display: 'inline-flex', alignItems: 'center', gap: '7px' }}><Share2 size={15} /> Chia sẻ</button>
                  )}
                  {voucher.status !== 'AVAILABLE' && <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 800 }}>{voucher.status === 'REDEEMED' ? 'Đã sử dụng' : 'Hết hạn'}</span>}
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ background: '#181c2e', color: '#fff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#ffd600', marginBottom: '8px' }}><Link2 size={20} /><h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900 }}>Nhận voucher được chia sẻ</h2></div>
          <p style={{ color: '#cbd5e1', lineHeight: 1.5, fontSize: '0.85rem', margin: '0 0 16px' }}>Dán mã trong link bạn bè gửi. Voucher sẽ được gắn vào tài khoản và chỉ dùng một lần.</p>
          <form onSubmit={handleClaim} style={{ display: 'grid', gap: '10px' }}>
            <input value={claimCode} onChange={(event) => setClaimCode(event.target.value)} placeholder="Ví dụ: SHR-AB12CD34EF56" style={{ width: '100%', border: '1px solid #475569', borderRadius: '9px', padding: '11px 12px', background: '#fff', color: '#0f172a' }} />
            <button type="submit" disabled={claiming} className="figma-btn-primary" style={{ width: '100%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '7px' }}><CheckCircle2 size={16} /> {claiming ? 'Đang nhận...' : 'Nhận voucher'}</button>
          </form>
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '14px', display: 'flex', gap: '7px', alignItems: 'center' }}><Copy size={14} /> Link đã chia sẻ sẽ tự điền mã khi mở trong ứng dụng.</div>
        </section>
      </div>
    </div>
  );
}
