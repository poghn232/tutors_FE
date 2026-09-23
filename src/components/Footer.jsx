import React from 'react';
import TutoraLogo from './TutoraLogo';
import { Clock } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      backgroundColor: '#111322',
      color: '#cbd5e1',
      padding: '48px 24px 28px 24px',
      borderTop: '1px solid #1e2238',
      fontFamily: "'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      <div style={{
        maxWidth: '1180px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
        gap: '36px',
        marginBottom: '40px'
      }}>
        {/* Col 1: Brand info & Social icons */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <TutoraLogo size="md" light={true} />
          </div>
          <p style={{
            fontSize: '0.88rem',
            lineHeight: '1.65',
            color: '#94a3b8',
            marginBottom: '20px',
            maxWidth: '300px'
          }}>
            Nền tảng kết nối gia sư - học sinh hàng đầu Việt Nam. Học tốt hơn, tiến bộ nhanh hơn cùng 2.400+ gia sư chuyên nghiệp.
          </p>

          {/* Social Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/profile.php?id=61594484406186"
              target="_blank" 
              rel="noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 900,
                fontSize: '1.1rem',
                boxShadow: '0 2px 6px rgba(24, 119, 242, 0.3)'
              }}
              title="Fanpage Facebook"
            >
              f
            </a>

            {/* Zalo */}
            <a 
              href="https://zalo.me/0358502232"
              target="_blank" 
              rel="noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0068ff',
                textDecoration: 'none',
                fontWeight: 900,
                fontSize: '0.72rem',
                letterSpacing: '-0.02em',
                boxShadow: '0 2px 6px rgba(0, 104, 255, 0.25)'
              }}
              title="Zalo hỗ trợ"
            >
              Zalo
            </a>

            {/* Gmail */}
            <a 
              href="mailto:giasututorasupport@gmail.com"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
              }}
              title="Email hỗ trợ"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M20 18h-2V9.5L12 14 6 9.5V18H4V6h1.5L12 11.5 18.5 6H20v12z"/>
                <path fill="#EA4335" d="M4 6h1.5L12 11.5V6z"/>
                <path fill="#FBBC05" d="M20 6h-1.5L12 11.5V6z"/>
                <path fill="#34A853" d="M4 18h2V9.5L4 8z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: Dành cho Học sinh */}
        <div>
          <h4 style={{
            color: '#ffffff',
            fontSize: '1.02rem',
            fontWeight: 800,
            marginBottom: '16px'
          }}>
            Dành cho Học sinh
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <button 
                type="button" 
                onClick={() => onNavigate && onNavigate('tutors')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Tìm gia sư
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onNavigate && onNavigate('classes')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Các môn học
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onNavigate && onNavigate('assignments')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Lộ trình học
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onNavigate && onNavigate('vip')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Gói VIP
              </button>
            </li>
            <li>
              <span style={{ color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer' }}>
                Đánh giá gia sư
              </span>
            </li>
          </ul>
        </div>

        {/* Col 3: Dành cho Gia sư */}
        <div>
          <h4 style={{
            color: '#ffffff',
            fontSize: '1.02rem',
            fontWeight: 800,
            marginBottom: '16px'
          }}>
            Dành cho Gia sư
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <button 
                type="button" 
                onClick={() => onNavigate && onNavigate('register')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Đăng ký dạy học
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onNavigate && onNavigate('lessons')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Quản lý lịch dạy
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onNavigate && onNavigate('materials')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Tải tài liệu
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onNavigate && onNavigate('checkout')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                Thanh toán
              </button>
            </li>
            <li>
              <span style={{ color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer' }}>
                Chính sách gia sư
              </span>
            </li>
          </ul>
        </div>

        {/* Col 4: Liên hệ */}
        <div>
          <h4 style={{
            color: '#ffffff',
            fontSize: '1.02rem',
            fontWeight: 800,
            marginBottom: '16px'
          }}>
            Liên hệ
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M20 18h-2V9.5L12 14 6 9.5V18H4V6h1.5L12 11.5 18.5 6H20v12z"/>
                  <path fill="#EA4335" d="M4 6h1.5L12 11.5V6z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email hỗ trợ</div>
                <a href="mailto:giasututorasupport@gmail.com" style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 700, textDecoration: 'none' }}>
                  giasututorasupport@gmail.com
                </a>
              </div>
            </div>

            {/* Zalo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#0068ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.65rem',
                flexShrink: 0
              }}>
                Zalo
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Zalo hỗ trợ</div>
                <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 700 }}>
                  0358502232
                </div>
              </div>
            </div>

            {/* Facebook */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1rem',
                flexShrink: 0
              }}>
                f
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Fanpage Facebook</div>
                <a href="https://www.facebook.com/profile.php?id=61594484406186" target="_blank" rel="noreferrer" style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 700, textDecoration: 'none' }}>
                  Facebook Tutora
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0
              }}>
                <Clock size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Giờ hỗ trợ</div>
                <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 700 }}>
                  7:00 – 22:00 hàng ngày
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        maxWidth: '1180px',
        margin: '0 auto 20px auto',
        height: '1px',
        backgroundColor: '#1e2238'
      }} />

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1180px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.82rem',
        color: '#64748b'
      }}>
        <div>
          © 2026 GiaSu.vn. Bảo lưu mọi quyền.
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <span style={{ cursor: 'pointer' }}>Điều khoản sử dụng</span>
          <span style={{ cursor: 'pointer' }}>Chính sách bảo mật</span>
          <span style={{ cursor: 'pointer' }}>Quy chế hoạt động</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'inline-block'
          }} />
          <span style={{ color: '#94a3b8' }}>Hệ thống đang hoạt động tốt</span>
        </div>
      </div>
    </footer>
  );
}
