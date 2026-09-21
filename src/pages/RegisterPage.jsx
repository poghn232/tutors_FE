import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { BookOpen, UserRound, Info, X } from 'lucide-react';
import TutoraLogo from '../components/TutoraLogo';
import { authService } from '../services/authService';

export default function RegisterPage({ onNavigate }) {
  const { register, loginWithGoogle } = useAuth();
  
  const [role, setRole] = useState(() => localStorage.getItem('giasuhq_last_role') || 'PARENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');
        const res = await loginWithGoogle({
          idToken: tokenResponse.access_token,
          role: role
        });
        if (res.success) {
          const userRole = res.data?.user?.role;
          if (!userRole) {
            setError('Không xác định được vai trò tài khoản. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
            return;
          }
          localStorage.setItem('giasuhq_last_role', userRole);
          onNavigate(authService.getDefaultViewForRole(userRole));
        } else {
          setError(res.message || 'Đăng ký bằng Google thất bại.');
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Đăng ký bằng Google thất bại. Vui lòng kiểm tra lại.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      console.error('Google register error:', err);
      setError('Đăng ký bằng Google đã bị hủy hoặc gặp sự cố.');
    }
  });

  const isGoogleLoginAllowed = role === 'PARENT';

  const handleGoogleClick = () => {
    if (!isGoogleLoginAllowed) {
      setError('Chỉ phụ huynh mới được đăng nhập bằng Google. Gia sư không được phép sử dụng tính năng này.');
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.trim() === '' || clientId.includes('dummy')) {
      setShowClientModal(true);
      return;
    }
    googleLoginTrigger();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        password,
        role
      });

      if (res.success) {
        const userRole = res.data?.user?.role;
        if (!userRole) {
          setError('Không xác định được vai trò tài khoản. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
          return;
        }
        localStorage.setItem('giasuhq_last_role', userRole);
        onNavigate(authService.getDefaultViewForRole(userRole));
      } else {
        setError(res.message || 'Đăng ký không thành công. Vui lòng thử lại.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra dữ liệu hoặc kết nối mạng.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="figma-auth-page compact">
      <div className="memphis shape-a" />
      <div className="memphis shape-b" />
      <div className="memphis shape-c" />
      <div className="memphis shape-d" />
      <div className="memphis shape-e" />

      <section className="auth-hero">
        <div className="auth-copy">
          <div style={{ marginBottom: '28px' }}>
            <TutoraLogo size="lg" subtitleText="Nền tảng Gia sư & AI" />
          </div>
          <div className="title-wrap">
            <span className="title-marker" />
            <h1>
              Bắt đầu cùng gia sư
              <span><strong>phù hợp</strong> hôm nay</span>
            </h1>
            <span className="title-dot" />
          </div>
          <p>
            Tạo tài khoản để tìm lớp học, quản lý lịch dạy và kết nối với cộng đồng học tập chất lượng.
          </p>
          <div className="auth-stats">
            <div className="stat-card yellow"><strong>100+</strong><span>Gia sư</span></div>
            <div className="stat-card orange"><strong>10+</strong><span>Môn học</span></div>
            <div className="stat-card purple"><strong>94%</strong><span>Hài lòng</span></div>
          </div>
          <div className="wave-line" aria-hidden="true" />
        </div>

        <div className="auth-panel register-panel">
          <div className="panel-corner" />
          <div className="panel-dot" />
          <div className="auth-tabs">
            <button type="button" onClick={() => onNavigate('login')}>Đăng nhập</button>
            <button type="button" className="active">Đăng ký</button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
          <div className="role-cards two">
            <button
              type="button"
              className={`role-card ${role === 'PARENT' ? 'active' : ''}`}
              onClick={() => { setRole('PARENT'); localStorage.setItem('giasuhq_last_role', 'PARENT'); setError(''); }}
            >
              <BookOpen size={22} />
              <strong>Phụ huynh</strong>
              <span>Quản lý con em</span>
            </button>
            <button
              type="button"
              className={`role-card ${role === 'TUTOR' ? 'active' : ''}`}
              onClick={() => { setRole('TUTOR'); localStorage.setItem('giasuhq_last_role', 'TUTOR'); setError(''); }}
            >
              <UserRound size={22} />
              <strong>Gia sư</strong>
              <span>Dạy học</span>
            </button>
          </div>

          <input
            id="fullName"
            type="text"
            className="auth-input"
            placeholder="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            id="phone"
            type="tel"
            className="auth-input"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="auth-field-grid">
            <input
              id="password"
              type="password"
              className="auth-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              id="confirmPassword"
              type="password"
              className="auth-input"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-primary" disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : 'Hoàn tất Đăng ký'}
          </button>
        </form>

        {isGoogleLoginAllowed && (
          <>
            <div className="divider"><span>Hoặc đăng ký nhanh với</span></div>
            <div className="social-row single">
              <button type="button" onClick={handleGoogleClick} disabled={loading}>
                <span className="google-mark">G</span> Đăng ký tài khoản nhanh với Google
              </button>
            </div>
          </>
        )}

        {showClientModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px'
          }}>
            <div style={{
              background: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%',
              padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', position: 'relative'
            }}>
              <button
                type="button"
                onClick={() => setShowClientModal(false)}
                style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#2563eb' }}>
                <Info size={24} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Cấu hình Google Client ID</h3>
              </div>
              <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
                Hệ thống đã sẵn sàng kết nối Google OAuth 2.0! Để đăng ký/đăng nhập tài khoản thật, bạn hãy điền <b>Client ID</b> từ Google Cloud Console vào file:
              </p>
              <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', color: '#1f2937', marginBottom: '14px', border: '1px solid #e5e7eb' }}>
                tutors_FE/.env<br />
                <b>VITE_GOOGLE_CLIENT_ID=</b>xxxxxxxx.apps.googleusercontent.com
              </div>
              <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.5', marginBottom: '20px' }}>
                💡 Hướng dẫn chi tiết tạo Client ID miễn phí có sẵn trong file <b>implementation_plan.md</b>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  style={{
                    padding: '8px 20px', borderRadius: '8px', border: 'none',
                    backgroundColor: '#2563eb', color: '#fff', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        )}

          <p className="auth-switch">
            Đã có tài khoản? <button type="button" onClick={() => onNavigate('login')}>Đăng nhập ngay</button>
          </p>
        </div>
      </section>
    </div>
  );
}
