import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { BookOpen, Eye, EyeOff, UserRound, Info, X } from 'lucide-react';
import TutoraLogo from '../components/TutoraLogo';

export default function LoginPage({ onNavigate }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoNotice, setInfoNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [showClientModal, setShowClientModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoNotice('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });
      if (res.success) {
        onNavigate('dashboard');
      } else {
        setError(res.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra kết nối Server.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');
        setInfoNotice('');
        const res = await loginWithGoogle({
          idToken: tokenResponse.access_token,
          role: selectedRole
        });
        if (res.success) {
          onNavigate('dashboard');
        } else {
          setError(res.message || 'Đăng nhập Google thất bại.');
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Đăng nhập bằng Google thất bại. Vui lòng kiểm tra kết nối Server.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      console.error('Google login error:', err);
      setError('Đăng nhập bằng Google đã bị hủy hoặc gặp sự cố.');
    }
  });

  const handleGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.trim() === '' || clientId.includes('dummy')) {
      setShowClientModal(true);
      return;
    }
    googleLoginTrigger();
  };

  return (
    <div className="figma-auth-page">
      <div className="memphis shape-a" />
      <div className="memphis shape-b" />
      <div className="memphis shape-c" />
      <div className="memphis shape-d" />
      <div className="memphis shape-e" />
      <div className="memphis shape-f" />

      <section className="auth-hero">
        <div className="auth-copy">
          <div style={{ marginBottom: '28px' }}>
            <TutoraLogo size="lg" subtitleText="Nền tảng Gia sư & AI" />
          </div>
          <div className="title-wrap">
            <span className="title-marker" />
            <h1>
              Học cùng gia sư
              <span><strong>chất lượng</strong> Việt Nam</span>
            </h1>
            <span className="title-dot" />
          </div>
          <p>
            Kết nối học sinh với các gia sư chất lượng cao trên toàn quốc. Học mọi lúc,
            mọi nơi, đúng môn, đúng trình độ.
          </p>

          <div className="auth-stats">
            <div className="stat-card yellow"><strong>100+</strong><span>Gia sư</span></div>
            <div className="stat-card orange"><strong>10+</strong><span>Môn học</span></div>
            <div className="stat-card purple"><strong>94%</strong><span>Hài lòng</span></div>
          </div>

          <div className="wave-line" aria-hidden="true" />
        </div>

        <div className="auth-panel">
          <div className="panel-corner" />
          <div className="panel-dot" />
          <div className="auth-tabs">
            <button type="button" className="active">Đăng nhập</button>
            <button type="button" onClick={() => onNavigate('register')}>Đăng ký</button>
          </div>

          <div className="role-cards two">
            <button 
              type="button" 
              className={`role-card ${selectedRole === 'STUDENT' ? 'active' : ''}`}
              onClick={() => setSelectedRole('STUDENT')}
            >
              <BookOpen size={25} />
              <strong>Học sinh / Phụ huynh</strong>
              <span>Tìm gia sư phù hợp</span>
            </button>
            <button 
              type="button" 
              className={`role-card ${selectedRole === 'TUTOR' ? 'active' : ''}`}
              onClick={() => setSelectedRole('TUTOR')}
            >
              <UserRound size={25} />
              <strong>Gia sư</strong>
              <span>Dạy & kiếm thêm thu nhập</span>
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {infoNotice && (
            <div className="alert" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{infoNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="Email / Số điện thoại"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, color: '#6b7280' }}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="form-row">
              <label className="remember"><input type="checkbox" /> Ghi nhớ đăng nhập</label>
              <button type="button" className="link-button" onClick={() => onNavigate('forgot-password')}>Quên mật khẩu?</button>
            </div>

            <button type="submit" className="auth-primary" disabled={loading}>
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="divider"><span>Hoặc tiếp tục với</span></div>
          <div className="social-row single">
            <button type="button" onClick={handleGoogleClick} disabled={loading}>
              <span className="google-mark">G</span> Tiếp tục với tài khoản Google
            </button>
          </div>

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
                  Chức năng đăng nhập Google đã được tích hợp hoàn tất trên cả Frontend và Backend! Để kết nối tài khoản Google thật, bạn hãy dán <b>Client ID</b> từ Google Cloud Console vào file:
                </p>
                <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', color: '#1f2937', marginBottom: '14px', border: '1px solid #e5e7eb' }}>
                  tutors_FE/.env<br />
                  <b>VITE_GOOGLE_CLIENT_ID=</b>xxxxxxxx.apps.googleusercontent.com
                </div>
                <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.5', marginBottom: '20px' }}>
                  💡 Hướng dẫn chi tiết 5 bước tạo Client ID miễn phí trên Google Console được lưu tại file <b>implementation_plan.md</b>.
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
            Chưa có tài khoản? <button type="button" onClick={() => onNavigate('register')}>Đăng ký ngay</button>
          </p>
        </div>
      </section>
    </div>
  );
}
