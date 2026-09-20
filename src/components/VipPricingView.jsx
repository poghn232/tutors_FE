import React, { useState } from 'react';
import { 
  Check, 
  Star, 
  ArrowLeft, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Mail, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import VNPayCheckoutModal from './VNPayCheckoutModal';

export default function VipPricingView({ onBack, onSelectVip, user, onRequireAuth }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [upgraded, setUpgraded] = useState(false);
  const [showVnpayModal, setShowVnpayModal] = useState(false);

  const faqs = [
    {
      q: 'Tôi có thể hủy gói bất cứ lúc nào không?',
      a: 'Hoàn toàn có thể. Bạn có thể hủy gia hạn gói bất kỳ lúc nào trong trang cài đặt tài khoản mà không phát sinh thêm bất kỳ chi phí nào.'
    },
    {
      q: 'Sự khác biệt giữa Cao cấp và VIP là gì?',
      a: 'Gói Cao cấp (VIP) bao gồm toàn bộ kho tài liệu ôn thi độc quyền có lời giải chi tiết, trợ lý AI phân tích điểm yếu học tập, và ưu tiên kết nối với các gia sư hàng đầu của Tutora.'
    },
    {
      q: 'Gói VIP có bao gồm học phí gia sư không?',
      a: 'Gói VIP bao gồm 1 buổi học trải nghiệm miễn phí mỗi tháng và toàn quyền truy cập nền tảng cao cấp. Học phí các buổi gia sư riêng theo giờ sẽ được thanh toán trực tiếp theo từng buổi.'
    },
    {
      q: 'Thanh toán được bảo mật như thế nào?',
      a: 'Tutora sử dụng tiêu chuẩn bảo mật mã hóa SSL 256-bit và liên kết với các đối tác thanh toán hàng đầu (Apple Pay, PayPal, thẻ Visa/MasterCard, cổng ngân hàng nội địa).'
    }
  ];

  const handleUpgrade = () => {
    if (!user && onRequireAuth) {
      onRequireAuth('nâng cấp gói VIP');
      return;
    }
    setShowVnpayModal(true);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 20px 60px', position: 'relative' }}>
      
      {/* Floating Geometric Shapes */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '-30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#fff4cc',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '120px',
        right: '-20px',
        width: '75px',
        height: '75px',
        backgroundColor: '#f3e8ff',
        transform: 'rotate(45deg)',
        borderRadius: '16px',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '200px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        backgroundColor: '#d1fae5',
        opacity: 0.6,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Header Bar */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
          )}

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#fffce8',
            border: '1.5px solid #0f172a',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#854d0e'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Nâng cấp tài khoản
          </div>
        </div>

        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 900,
          color: '#0f172a',
          margin: '0 0 8px 0',
          fontFamily: 'serif'
        }}>
          Mở khóa Toàn bộ Tiềm năng Học tập
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#64748b', margin: '0 0 24px 0' }}>
          Chọn gói phù hợp với mục tiêu của bạn
        </p>

        {/* Pill switcher: Hàng tháng / Hàng năm */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: '#181b2a',
          borderRadius: '999px',
          padding: '4px'
        }}>
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            style={{
              border: 'none',
              padding: '8px 20px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: billingCycle === 'monthly' ? '#ffffff' : 'transparent',
              color: billingCycle === 'monthly' ? '#0f172a' : '#94a3b8',
              transition: 'all 0.15s ease'
            }}
          >
            Hàng tháng
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            style={{
              border: 'none',
              padding: '8px 20px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: billingCycle === 'yearly' ? '#ffffff' : 'transparent',
              color: billingCycle === 'yearly' ? '#0f172a' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            Hàng năm
            <span style={{
              backgroundColor: '#00e599',
              color: '#0f172a',
              fontSize: '0.72rem',
              fontWeight: 900,
              padding: '1px 6px',
              borderRadius: '999px'
            }}>
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards (2 Columns: Free vs Cao cấp) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '48px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Plan 1: Miễn phí */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #0f172a',
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#f1f5f9',
              color: '#475569',
              padding: '3px 10px',
              borderRadius: '999px',
              marginBottom: '12px'
            }}>
              Hiện tại
            </span>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', fontFamily: 'serif' }}>
              Miễn phí
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', fontFamily: 'serif' }}>
                0đ
              </span>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>/tháng</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                'Liên hệ với gia sư miễn phí',
                'Đặt lịch không giới hạn',
                'Tài liệu học tập cơ bản',
                'Thống kê tiến độ học',
                'Báo cáo học tập hàng tuần',
                'Hỗ trợ qua email',
                'Ghi hình buổi học'
              ].map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
                  <Check size={16} color="#7c3aed" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              border: 'none',
              backgroundColor: '#f1f5f9',
              color: '#94a3b8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'not-allowed'
            }}
          >
            Gói hiện tại của bạn
          </button>
        </div>

        {/* Plan 2: Cao cấp (Dark card with Yellow elements) */}
        <div style={{
          backgroundColor: '#181b2a',
          border: '2px solid #0f172a',
          borderRadius: '24px',
          padding: '32px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '6px 6px 0px #0f172a',
          position: 'relative'
        }}>
          <div>
            <span style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 800,
              backgroundColor: '#ffd600',
              color: '#0f172a',
              padding: '3px 12px',
              borderRadius: '999px',
              marginBottom: '12px'
            }}>
              Cao cấp
            </span>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: '0 0 6px 0', fontFamily: 'serif' }}>
              Cao cấp
            </h3>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffd600', fontFamily: 'serif' }}>
                {billingCycle === 'yearly' ? '159.000đ' : '199.000đ'}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>/tháng</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '32px' }}>
              {[
                'Tất cả tính năng Miễn phí',
                'Tất cả tài liệu độc quyền',
                'Gia sư riêng được chỉ định',
                'Buổi học thử nghiệm miễn phí mỗi tháng',
                'Kế hoạch học cá nhân hóa chuyên sâu',
                'Phân tích điểm yếu bằng AI',
                'Tư vấn chọn trường & ngành học',
                'Ôn luyện đề thi chuyên biệt',
                'Phụ huynh nhận báo cáo chi tiết hàng tuần',
                'Ưu tiên đặt lịch với gia sư top',
                'Hỗ trợ qua điện thoại',
                'Không giới hạn tải tài liệu'
              ].map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#e2e8f0' }}>
                  <Star size={14} color="#ffd600" fill="#ffd600" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleUpgrade}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              backgroundColor: '#ffd600',
              color: '#0f172a',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 3px 0 #000',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#facc15'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffd600'}
          >
            {upgraded ? '✓ Đã kích hoạt Cao cấp!' : 'Nâng cấp lên Cao cấp'}
          </button>
        </div>
      </div>

      {/* Feature Comparison Table ("So sánh tính năng") */}
      <div style={{ marginBottom: '56px', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.6rem',
          fontWeight: 900,
          color: '#0f172a',
          margin: '0 0 28px 0',
          fontFamily: 'serif'
        }}>
          So sánh tính năng
        </h2>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #0f172a',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #0f172a', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Tính năng</th>
                <th style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 800, color: '#64748b' }}>Miễn phí</th>
                <th style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 800, color: '#ea580c' }}>Cao cấp</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Buổi học/tháng', free: '18', vip: 'Không giới hạn' },
                { name: 'Tài liệu học', free: 'Tài liệu cơ bản', vip: 'Tài liệu độc quyền' },
                { name: 'Lộ trình học AI', free: '✕', vip: 'Nâng cao' },
                { name: 'Gia sư', free: 'Liên hệ miễn phí', vip: 'Ưu tiên đặt lịch' },
                { name: 'Báo cáo phụ huynh', free: 'Hàng tuần', vip: 'Chi tiết hàng ngày' },
                { name: 'Ghi hình buổi học', free: '✕', vip: '✓' },
                { name: 'Hỗ trợ', free: 'Email', vip: 'Điện thoại' }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx < 6 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{row.name}</td>
                  <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#64748b' }}>{row.free}</td>
                  <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 700, color: '#ea580c' }}>{row.vip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Testimonials ("Phụ huynh nói gì về Tutora?") */}
      <div style={{ marginBottom: '56px', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.6rem',
          fontWeight: 900,
          color: '#0f172a',
          margin: '0 0 28px 0',
          fontFamily: 'serif'
        }}>
          Phụ huynh nói gì về Tutora?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {[
            {
              quote: '“Gói VIP thực sự thay đổi việc học của con tôi. Gia sư năng nổ, tận tâm và báo cáo hàng tuần giúp tôi nắm rõ tiến độ học tập.”',
              name: 'Nguyễn Thị Hoa',
              role: 'Phụ huynh học sinh lớp 11'
            },
            {
              quote: '“Tính năng phân tích điểm yếu bằng AI cực kỳ hữu ích. Con tôi đã cải thiện điểm Toán từ 6 lên 9 chỉ sau 2 tháng dùng VIP.”',
              name: 'Trần Văn Minh',
              role: 'Phụ huynh học sinh lớp 9'
            },
            {
              quote: '“Tư vấn chọn trường và ngành học rất chuyên sâu. Đội ngũ hỗ trợ qua điện thoại luôn sẵn sàng giải đáp bất kỳ lúc nào.”',
              name: 'Lê Thị Bảo Châu',
              role: 'Phụ huynh học sinh lớp 12'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#181b2a',
                border: '1.5px solid #0f172a',
                borderRadius: '20px',
                padding: '24px',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} color="#ffd600" fill="#ffd600" />
                  ))}
                </div>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                  {item.quote}
                </p>
              </div>

              <div style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '14px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>{item.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ ("Câu hỏi thường gặp") */}
      <div style={{ marginBottom: '48px', position: 'relative', zIndex: 1, maxWidth: '850px', margin: '0 auto 48px' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.6rem',
          fontWeight: 900,
          color: '#0f172a',
          margin: '0 0 28px 0',
          fontFamily: 'serif'
        }}>
          Câu hỏi thường gặp
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #0f172a',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ color: '#7c3aed', fontSize: '1.2rem', fontWeight: 900 }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 24px 18px', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact CTA Banner (Figma 15:5173 Orange Box) */}
      <div style={{
        backgroundColor: '#ff5f38',
        border: '2px solid #0f172a',
        borderRadius: '20px',
        padding: '24px 32px',
        textAlign: 'center',
        color: '#ffffff',
        maxWidth: '560px',
        margin: '0 auto',
        boxShadow: '4px 4px 0px #0f172a',
        position: 'relative',
        zIndex: 1
      }}>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 6px 0' }}>
          Còn câu hỏi? Liên hệ ngay!
        </h4>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#fff1ed', fontWeight: 600 }}>
          support@giasu.vn · 1900 1234 · 8:00 - 22:00
        </p>
      </div>

      {showVnpayModal && (
        <VNPayCheckoutModal 
          initialPlan={billingCycle === 'yearly' ? 'year' : 'month'} 
          onClose={() => setShowVnpayModal(false)} 
        />
      )}

    </div>
  );
}
