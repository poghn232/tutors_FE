import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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

  return (
    <div className="card auth-card">
      <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '4px' }}>Đăng nhập GiaSuHQ</h2>
      <p className="subtitle" style={{ textAlign: 'center' }}>
        Chào mừng bạn quay trở lại. Hãy đăng nhập để truy cập hệ thống.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Địa chỉ Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="nhapemail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label htmlFor="password" style={{ marginBottom: 0 }}>Mật khẩu</label>
          </div>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block" 
          disabled={loading}
          style={{ marginTop: '8px' }}
        >
          {loading ? 'Đang xác thực...' : 'Đăng nhập'}
        </button>
      </form>

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
        Chưa có tài khoản?{' '}
        <span 
          onClick={() => onNavigate('register')} 
          style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Đăng ký ngay
        </span>
      </div>
    </div>
  );
}
