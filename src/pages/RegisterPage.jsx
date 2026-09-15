import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, UserRound } from 'lucide-react';

export default function RegisterPage({ onNavigate }) {
  const { register } = useAuth();
  
  const [role, setRole] = useState('TUTOR');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        fullName,
        email,
        phone,
        password,
        role
      });

      if (res.success) {
        onNavigate('dashboard');
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
          <div className="role-cards three">
            <button
              type="button"
              className={`role-card ${role === 'TUTOR' ? 'active' : ''}`}
              onClick={() => setRole('TUTOR')}
            >
              <UserRound size={22} />
              <strong>Gia sư</strong>
              <span>Dạy học</span>
            </button>
            <button
              type="button"
              className={`role-card ${role === 'PARENT' ? 'active' : ''}`}
              onClick={() => setRole('PARENT')}
            >
              <BookOpen size={22} />
              <strong>Phụ huynh</strong>
              <span>Tìm gia sư</span>
            </button>
            <button
              type="button"
              className={`role-card ${role === 'STUDENT' ? 'active' : ''}`}
              onClick={() => setRole('STUDENT')}
            >
              <BookOpen size={22} />
              <strong>Học sinh</strong>
              <span>Học tốt hơn</span>
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

          <p className="auth-switch">
            Đã có tài khoản? <button type="button" onClick={() => onNavigate('login')}>Đăng nhập ngay</button>
          </p>
        </div>
      </section>
    </div>
  );
}
