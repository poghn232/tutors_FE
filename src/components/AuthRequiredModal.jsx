import React from 'react';
import { Lock, LogIn, UserPlus, X, Sparkles, ShieldCheck } from 'lucide-react';

export default function AuthRequiredModal({ 
  isOpen, 
  onClose, 
  onNavigate, 
  actionName = 'sử dụng tính năng này' 
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '2.5px solid #0f172a',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        padding: '32px 28px',
        boxShadow: '8px 8px 0px #0f172a',
        position: 'relative',
        textAlign: 'center',
        animation: 'modalSlideUp 0.25s ease'
      }}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={22} />
        </button>

        {/* Big Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          backgroundColor: '#fff7ed',
          border: '2px solid #0f172a',
          color: '#ff5f38',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          boxShadow: '3px 3px 0px #0f172a'
        }}>
          <Lock size={30} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '1.4rem',
          fontWeight: 900,
          color: '#0f172a',
          margin: '0 0 10px 0',
          fontFamily: "'Playfair Display', Georgia, serif"
        }}>
          Yêu cầu Đăng nhập
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '0.92rem',
          color: '#475569',
          lineHeight: '1.5',
          margin: '0 0 24px 0'
        }}>
          Bạn đang xem website với tư cách <b>Khách</b>. Vui lòng đăng nhập hoặc tạo tài khoản miễn phí để <b>{actionName}</b>!
        </p>

        {/* Benefits badge */}
        <div style={{
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '14px',
          padding: '12px 16px',
          marginBottom: '24px',
          textAlign: 'left',
          fontSize: '0.82rem',
          color: '#334155',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={15} color="#ea580c" />
            <span>Miễn phí 100% khi tạo tài khoản học viên mới</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={15} color="#059669" />
            <span>Kết nối gia sư chất lượng & theo dõi tiến độ học</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('login');
            }}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              border: '2px solid #0f172a',
              backgroundColor: '#ff5f38',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <LogIn size={18} />
            Đăng nhập ngay
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('register');
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1.5px solid #0f172a',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <UserPlus size={18} />
            Tạo tài khoản mới
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px',
              marginTop: '4px'
            }}
          >
            Để sau, tôi muốn tiếp tục xem trang
          </button>
        </div>

      </div>
    </div>
  );
}
