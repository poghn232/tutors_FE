import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Eye, UserRound, UsersRound } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

  const [selectedRole, setSelectedRole] = useState('STUDENT');

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
                type="password"
                className="auth-input"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Eye size={18} />
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
          <div className="social-row">
            <button type="button"><span className="google-mark">G</span> Google</button>
            <button type="button"><UsersRound size={14} /> Facebook</button>
          </div>

          <p className="auth-switch">
            Chưa có tài khoản? <button type="button" onClick={() => onNavigate('register')}>Đăng ký ngay</button>
          </p>
        </div>
      </section>

      <footer className="auth-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo"><BookOpen size={24} /> TutorA</div>
            <p>Nền tảng kết nối gia sư - học sinh hàng đầu Việt Nam. Học tốt hơn, tiến bộ nhanh hơn cùng 2.400+ gia sư chuyên nghiệp.</p>
            <div className="footer-socials"><span>f</span><span>Zalo</span><span>M</span></div>
          </div>
          <div><h4>Dành cho Học sinh</h4><p>Tìm gia sư</p><p>Các môn học</p><p>Lộ trình học</p><p>Gói VIP</p><p>Đánh giá gia sư</p></div>
          <div><h4>Dành cho Gia sư</h4><p>Đăng ký dạy học</p><p>Quản lý lịch dạy</p><p>Tải tài liệu</p><p>Thanh toán</p><p>Chính sách gia sư</p></div>
          <div><h4>Liên hệ</h4><p><b>Email hỗ trợ</b><br />hotro@giasu.vn</p><p><b>Zalo hỗ trợ</b><br />0901 234 567</p><p><b>Fanpage Facebook</b><br />facebook.com/giasu.vn</p><p><b>Giờ hỗ trợ</b><br />7:00 - 22:00 hàng ngày</p></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 GiaSư.vn. Bảo lưu mọi quyền.</span>
          <span>Điều khoản sử dụng&nbsp;&nbsp;&nbsp; Chính sách bảo mật&nbsp;&nbsp;&nbsp; Quy chế hoạt động</span>
          <span className="status-dot">Hệ thống đang hoạt động tốt</span>
        </div>
      </footer>
      </div>
  );
}
