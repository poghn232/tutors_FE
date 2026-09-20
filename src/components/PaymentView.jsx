import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import { 
  CreditCard, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ArrowRight, 
  DollarSign,
  Building2,
  AlertCircle,
  X,
  TrendingUp,
  Download
} from 'lucide-react';

export default function PaymentView() {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview', 'settings', 'history'
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('423750');
  const [bankAccount, setBankAccount] = useState({
    bank: 'Vietcombank',
    accountNumber: '1029384756',
    accountName: 'HOANG THIEN UNG'
  });
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

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

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 48px', position: 'relative' }}>
      
      {/* Floating Background Decorative Shapes (matching Figma 35:3300) */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '-30px',
        width: '65px',
        height: '65px',
        borderRadius: '50%',
        backgroundColor: '#fff4cc',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '120px',
        width: '36px',
        height: '36px',
        backgroundColor: '#ffe2da',
        transform: 'rotate(15deg)',
        borderRadius: '6px',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '50px',
        right: '-10px',
        width: '80px',
        height: '80px',
        backgroundColor: '#f3e8ff',
        transform: 'rotate(45deg)',
        borderRadius: '16px',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '430px',
        left: '-20px',
        width: '18px',
        height: '60px',
        borderRadius: '999px',
        backgroundColor: '#ffe4e6',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '470px',
        right: '120px',
        width: '28px',
        height: '28px',
        backgroundColor: '#ffe2da',
        transform: 'rotate(-10deg)',
        borderRadius: '6px',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '-40px',
        width: '190px',
        height: '190px',
        borderRadius: '50%',
        backgroundColor: '#d1fae5',
        opacity: 0.6,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Header Section */}
      <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 900, 
          color: '#0f172a', 
          margin: '0 0 6px 0',
          fontFamily: 'serif'
        }}>
          Thanh toán & Rút tiền
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
          Theo dõi thu nhập và quản lý phương thức nhận tiền
        </p>
      </div>

      {/* Navigation Pills (Figma 35:3300) */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid #0f172a',
        borderRadius: '16px',
        padding: '6px',
        display: 'inline-flex',
        gap: '8px',
        marginBottom: '28px',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '700px'
      }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('overview')}
          style={{
            flex: 1,
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'overview' ? '#181b2a' : 'transparent',
            color: activeSubTab === 'overview' ? '#ffffff' : '#64748b',
            transition: 'all 0.15s ease'
          }}
        >
          Tổng quan
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          style={{
            flex: 1,
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'settings' ? '#181b2a' : 'transparent',
            color: activeSubTab === 'settings' ? '#ffffff' : '#64748b',
            transition: 'all 0.15s ease'
          }}
        >
          Cài đặt Rút tiền
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          style={{
            flex: 1,
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'history' ? '#181b2a' : 'transparent',
            color: activeSubTab === 'history' ? '#ffffff' : '#64748b',
            transition: 'all 0.15s ease'
          }}
        >
          Lịch sử
        </button>
      </div>

      {activeSubTab === 'overview' && (
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 3 Top Stat Cards (Figma 35:3300) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            
            {/* Card 1: SỐ DƯ KHẢ DỤNG (Dark card with Yellow Button) */}
            <div style={{
              backgroundColor: '#181c2e',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '190px',
              color: '#ffffff'
            }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#94a3b8'
                }}>
                  SỐ DƯ KHẢ DỤNG
                </span>
                <div style={{
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: '#ffd600',
                  marginTop: '8px',
                  fontFamily: 'serif'
                }}>
                  423.750đ
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                  Sẵn sàng rút
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                style={{
                  width: '100%',
                  marginTop: '18px',
                  padding: '12px',
                  backgroundColor: '#ffd600',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 0 #000',
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#facc15'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffd600'}
              >
                Rút tiền ngay
              </button>
            </div>

            {/* Card 2: CHỜ XỬ LÝ (Mint card) */}
            <div style={{
              backgroundColor: '#eafaf3',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              minHeight: '190px'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#64748b'
              }}>
                CHỜ XỬ LÝ
              </span>
              <div style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#00c282',
                marginTop: '8px',
                fontFamily: 'serif'
              }}>
                425.000đ
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                Từ buổi học sắp tới
              </div>
            </div>

            {/* Card 3: TỔNG THU NHẬP (Lavender card) */}
            <div style={{
              backgroundColor: '#f5f0ff',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              minHeight: '190px'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#64748b'
              }}>
                TỔNG THU NHẬP
              </span>
              <div style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#7c3aed',
                marginTop: '8px',
                fontFamily: 'serif'
              }}>
                1.063.750đ
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                Thu nhập ròng tất cả thời gian
              </div>
            </div>
          </div>

          {/* Earnings Timeline Card: Thu nhập — Tháng 9/2026 */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '24px 28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Thu nhập — Tháng 9/2026
              </h3>
              <span style={{ color: '#00c282', fontWeight: 800, fontSize: '0.88rem' }}>
                +24% so với tháng 8
              </span>
            </div>

            {/* 4 Colored Bars Timeline */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '10px' }}>
              <div>
                <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#ff5733', width: '100%' }} />
                <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
                  01/09
                </div>
              </div>

              <div>
                <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#7c3aed', width: '100%' }} />
                <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
                  07/09
                </div>
              </div>

              <div>
                <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#00b4d8', width: '100%' }} />
                <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
                  14/09
                </div>
              </div>

              <div>
                <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#ffd600', width: '100%' }} />
                <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
                  21/09
                </div>
              </div>
            </div>
          </div>

          {/* Chi tiết Phí nền tảng (Figma 35:3300) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '850px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 20px 0' }}>
              Chi tiết Phí nền tảng
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Row 1: Buổi học */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    Buổi học
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                    Mỗi buổi 60 phút theo học phí của bạn
                  </div>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  250.000đ
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

              {/* Row 2: Phí nền tảng */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    Phí nền tảng (15%)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                    Bao gồm xử lý thanh toán, hỗ trợ, bảo hiểm
                  </div>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444' }}>
                  -37.500đ
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

              {/* Row 3: Bạn nhận */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                    Bạn nhận
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                    Thực nhận mỗi buổi
                  </div>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00c282' }}>
                  212.500đ
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Cài đặt Rút tiền Tab */}
      {activeSubTab === 'settings' && (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '28px'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 20px 0' }}>
              Thông tin Tài khoản Ngân hàng nhận tiền
            </h3>

            <form onSubmit={(e) => { e.preventDefault(); alert('Cập nhật tài khoản ngân hàng thành công!'); }}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Ngân hàng thụ hưởng (*)
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #0f172a',
                    fontSize: '0.9rem'
                  }}
                  value={bankAccount.bank}
                  onChange={(e) => setBankAccount({ ...bankAccount, bank: e.target.value })}
                >
                  <option value="Vietcombank">Vietcombank - TMCP Ngoại Thương VN</option>
                  <option value="Techcombank">Techcombank - TMCP Kỹ Thương</option>
                  <option value="MBBank">MB Bank - Ngân hàng Quân Đội</option>
                  <option value="BIDV">BIDV - Đầu tư và Phát triển VN</option>
                  <option value="ACB">ACB - Á Châu</option>
                  <option value="TPBank">TPBank - Tiên Phong</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Số tài khoản ngân hàng (*)
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #0f172a',
                    fontSize: '0.9rem'
                  }}
                  value={bankAccount.accountNumber}
                  onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Tên chủ tài khoản (viết hoa không dấu) (*)
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #0f172a',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                  }}
                  value={bankAccount.accountName}
                  onChange={(e) => setBankAccount({ ...bankAccount, accountName: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-brutal-black"
                style={{ padding: '12px 28px', fontSize: '0.92rem' }}
              >
                Lưu phương thức nhận tiền
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lịch sử Rút tiền Tab */}
      {activeSubTab === 'history' && (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '850px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
              Lịch sử giao dịch & Rút tiền
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff'
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    Rút tiền về Vietcombank (***4756)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    10/09/2026 · Mã GD: WD-948271
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                    -640.000đ
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                    Thành công
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff'
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    Học phí từ học sinh Quốc Khánh (Buổi 1)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    08/09/2026 · Tin học 11
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#00c282', fontSize: '1rem' }}>
                    +212.500đ
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                    Đã cộng số dư
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff'
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    Học phí từ học sinh Minh Anh (Buổi 2)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    05/09/2026 · Toán 12
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#00c282', fontSize: '1rem' }}>
                    +212.500đ
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                    Đã cộng số dư
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Yêu cầu Rút tiền */}
      {showWithdrawModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            boxShadow: '6px 6px 0px #0f172a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Yêu cầu Rút tiền về Ngân hàng
              </h3>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            {withdrawSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={48} color="#00c282" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  Yêu cầu rút tiền thành công!
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                  Tiền sẽ được chuyển về tài khoản Vietcombank của bạn trong vòng 1-2 giờ làm việc.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '18px'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                    Tài khoản nhận tiền:
                  </div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', marginTop: '2px' }}>
                    {bankAccount.bank} · {bankAccount.accountNumber}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                    Chủ tài khoản: {bankAccount.accountName}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Số tiền muốn rút (Tối đa: 423.750đ)
                  </label>
                  <input
                    type="number"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #0f172a',
                      fontSize: '1.1rem',
                      fontWeight: 800
                    }}
                    value={withdrawAmount}
                    max={423750}
                    min={50000}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '12px',
                      border: '1.5px solid #0f172a',
                      backgroundColor: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-brutal-black"
                    style={{ padding: '10px 24px' }}
                  >
                    Xác nhận Rút tiền
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
