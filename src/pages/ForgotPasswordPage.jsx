import React, { useMemo, useState } from 'react';
import { Check, KeyRound, LockKeyhole, MailCheck, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordScore = useMemo(() => {
    return [
      password.length >= 8,
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ].filter(Boolean).length;
  }, [password]);

  const maskedAccount = account || '+84 03682638';

  const handleOtpChange = (index, value) => {
    const next = [...otp];
    next[index] = value.replace(/\D/g, '').slice(0, 1);
    setOtp(next);
  };

  const goNext = (e) => {
    e.preventDefault();
    setStep((current) => Math.min(current + 1, 4));
  };

  const requirements = [
    ['Ít nhất 8 ký tự', password.length >= 8],
    ['Có chữ hoa (A-Z)', /[A-Z]/.test(password)],
    ['Có chữ số (0-9)', /\d/.test(password)],
    ['Có ký tự đặc biệt (!@#$...)', /[^A-Za-z0-9]/.test(password)]
  ];

  return (
    <div className="figma-auth-page forgot-page">
      <div className="memphis shape-a" />
      <div className="memphis shape-b" />
      <div className="memphis shape-c" />
      <div className="memphis shape-d" />
      <div className="memphis shape-e" />
      <section className="forgot-shell">
        <div className="forgot-topbar">
          <button type="button" onClick={() => onNavigate('login')}>GiaSư.vn</button>
          <span>Bước {step}/4</span>
        </div>

        <div className="forgot-card">
          <div className="progress-dots">
            {[1, 2, 3, 4].map((item) => (
              <span key={item} className={item <= step ? 'active' : ''} />
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={goNext} className="forgot-step">
              <div className="forgot-heading">
                <span><KeyRound size={24} /></span>
                <div>
                  <h1>Khôi phục mật khẩu</h1>
                  <p>Nhập email hoặc số điện thoại tài khoản</p>
                </div>
              </div>
              <p className="forgot-copy">
                Chúng tôi sẽ gửi mã xác minh để đảm bảo chỉ chủ tài khoản mới có thể đặt lại mật khẩu.
              </p>
              <input
                className="auth-input"
                placeholder="Email / Số điện thoại"
                value={account}
                onChange={(event) => setAccount(event.target.value)}
                required
              />
              <button className="auth-primary" type="submit">Gửi mã xác minh</button>
              <button className="forgot-back" type="button" onClick={() => onNavigate('login')}>← Quay lại</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={goNext} className="forgot-step">
              <div className="forgot-heading">
                <span><MailCheck size={24} /></span>
                <div>
                  <h1>Xác minh OTP</h1>
                  <p>Kiểm tra hộp thư hoặc tin nhắn</p>
                </div>
              </div>
              <div className="otp-notice">
                <span>Mã đã được gửi đến {maskedAccount}</span>
                <button type="button" onClick={() => setStep(1)}>Sửa</button>
              </div>
              <div className="otp-grid">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    inputMode="numeric"
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    aria-label={`OTP ${index + 1}`}
                  />
                ))}
              </div>
              <p className="resend-text">Gửi lại sau 58s</p>
              <p className="forgot-hint">Kiểm tra thư mục Spam nếu không nhận được email</p>
              <button className="auth-primary" type="submit">Xác nhận</button>
              <button className="forgot-back" type="button" onClick={() => setStep(1)}>← Quay lại</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={goNext} className="forgot-step">
              <div className="forgot-heading">
                <span><LockKeyhole size={24} /></span>
                <div>
                  <h1>Đặt mật khẩu mới</h1>
                  <p>Chọn mật khẩu an toàn cho tài khoản</p>
                </div>
              </div>
              <p className="forgot-copy">Mật khẩu mới phải có ít nhất 3/4 tiêu chí bảo mật bên dưới.</p>
              <label className="forgot-label">Mật khẩu mới</label>
              <input
                className="auth-input"
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <div className="strength-meter">
                {[1, 2, 3, 4].map((item) => (
                  <span key={item} className={item <= passwordScore ? 'active' : ''} />
                ))}
              </div>
              <div className="requirements">
                {requirements.map(([label, met]) => (
                  <span key={label} className={met ? 'met' : ''}>{met ? '✓' : '○'} {label}</span>
                ))}
              </div>
              <label className="forgot-label">Xác nhận mật khẩu mới</label>
              <input
                className="auth-input"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <button className="auth-primary" type="submit" disabled={passwordScore < 3 || password !== confirmPassword}>
                Cập nhật mật khẩu
              </button>
              <button className="forgot-back" type="button" onClick={() => setStep(2)}>← Quay lại</button>
            </form>
          )}

          {step === 4 && (
            <div className="forgot-step success-step">
              <div className="success-check"><Check size={40} /></div>
              <h1>Mật khẩu đã được cập nhật thành công!</h1>
              <p>Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ</p>
              <div className="success-note">
                <Check size={18} />
                <div>
                  <strong>Bảo mật tài khoản đã được cập nhật</strong>
                  <span>13:01 15/09/2026</span>
                </div>
              </div>
              <button className="auth-primary" type="button" onClick={() => onNavigate('login')}>Đăng nhập ngay</button>
              <p className="forgot-hint">Tự động chuyển hướng sau 4s...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
