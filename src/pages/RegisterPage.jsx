import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    <div className="card auth-card" style={{ maxWidth: '520px' }}>
      <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '4px' }}>Tạo tài khoản GiaSuHQ</h2>
      <p className="subtitle" style={{ textAlign: 'center' }}>
        Chọn vai trò và nhập thông tin để khởi tạo tài khoản mới.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Bạn là ai trong hệ thống? (*)</label>
          <div className="role-selector">
            <button
              type="button"
              className={`role-pill ${role === 'TUTOR' ? 'active' : ''}`}
              onClick={() => setRole('TUTOR')}
            >
              👨‍🏫 Gia sư
            </button>
            <button
              type="button"
              className={`role-pill ${role === 'PARENT' ? 'active' : ''}`}
              onClick={() => setRole('PARENT')}
            >
              👨‍👩‍👧 Phụ huynh
            </button>
            <button
              type="button"
              className={`role-pill ${role === 'STUDENT' ? 'active' : ''}`}
              onClick={() => setRole('STUDENT')}
            >
              🎒 Học sinh
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fullName">Họ và tên (*)</label>
          <input
            id="fullName"
            type="text"
            className="form-control"
            placeholder="Ví dụ: Nguyễn Văn An"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Địa chỉ Email (*)</label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="nguyenvanan@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại liên hệ</label>
          <input
            id="phone"
            type="tel"
            className="form-control"
            placeholder="0912345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu (*)</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Nhập lại mật khẩu (*)</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block" 
          disabled={loading}
          style={{ marginTop: '12px' }}
        >
          {loading ? 'Đang tạo tài khoản...' : 'Hoàn tất Đăng ký'}
        </button>
      </form>

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
        Đã có tài khoản?{' '}
        <span 
          onClick={() => onNavigate('login')} 
          style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Đăng nhập ngay
        </span>
      </div>
    </div>
  );
}
