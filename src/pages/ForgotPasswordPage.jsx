import React, { useMemo, useState, useEffect } from 'react';
import { Check, KeyRound, LockKeyhole, MailCheck, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import TutoraLogo from '../components/TutoraLogo';
import { authService } from '../services/authService';

export default function ForgotPasswordPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(60);

  // Timer countdown for resending OTP in Step 2
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Auto-redirect in Step 4
  useEffect(() => {
    if (step === 4) {
      const redirectTimer = setTimeout(() => {
        if (onNavigate) onNavigate('login');
      }, 3500);
      return () => clearTimeout(redirectTimer);
    }
  }, [step, onNavigate]);

  const passwordScore = useMemo(() => {
    return [
      password.length >= 8,
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ].filter(Boolean).length;
  }, [password]);

  const maskedAccount = account || 'email của bạn';

  const handleOtpChange = (index, value) => {
    const next = [...otp];
    next[index] = value.replace(/\D/g, '').slice(0, 1);
    setOtp(next);
    setErrorMessage('');

    // Auto-focus next input if digit entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Step 1: Submit email to request OTP via Gmail
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const email = account.trim().toLowerCase();
    if (!email) {
      setErrorMessage('Vui lòng nhập địa chỉ email tài khoản.');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccessMessage(`Mã xác nhận 6 số đã được gửi về Gmail: ${email}`);
      setCountdown(60);
      setStep(2);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Không thể gửi mã xác nhận. Vui lòng kiểm tra lại email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await authService.forgotPassword(account.trim().toLowerCase());
      setSuccessMessage(`Đã gửi lại mã xác nhận mới về Gmail: ${account}`);
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Gửi lại mã thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(account.trim().toLowerCase(), otpCode);
      setSuccessMessage('Xác thực OTP thành công!');
      setStep(3);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (passwordScore < 3) {
      setErrorMessage('Mật khẩu mới chưa đáp ứng đủ tiêu chí bảo mật.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu nhập lại không khớp.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(account.trim().toLowerCase(), otp.join(''), password);
      setStep(4);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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
          <div onClick={() => onNavigate('login')} style={{ cursor: 'pointer' }}>
            <TutoraLogo size="sm" showSubtitle={false} />
          </div>
          <span>Bước {step}/4</span>
        </div>

        <div className="forgot-card">
          <div className="progress-dots">
            {[1, 2, 3, 4].map((item) => (
              <span key={item} className={item <= step ? 'active' : ''} />
            ))}
          </div>

          {/* Error and Success Alerts */}
          {errorMessage && (
            <div style={{
              background: '#fee2e2',
              border: '1.5px solid #ef4444',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#b91c1c',
              fontSize: '0.86rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && !errorMessage && (
            <div style={{
              background: '#ecfdf5',
              border: '1.5px solid #10b981',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#065f46',
              fontSize: '0.86rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <Check size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="forgot-step">
              <div className="forgot-heading">
                <span><KeyRound size={24} /></span>
                <div>
                  <h1>Khôi phục mật khẩu</h1>
                  <p>Nhập email đăng ký tài khoản</p>
                </div>
              </div>
              <p className="forgot-copy">
                Hệ thống sẽ tự động gửi mã xác minh 6 số qua Gmail để xác thực chủ tài khoản.
              </p>
              <input
                type="email"
                className="auth-input"
                placeholder="Nhập địa chỉ email của bạn"
                value={account}
                onChange={(event) => {
                  setAccount(event.target.value);
                  setErrorMessage('');
                }}
                required
              />
              <button className="auth-primary" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <><Loader2 size={18} className="animate-spin" /> Đang gửi mã về Gmail...</> : 'Gửi mã xác minh về Gmail'}
              </button>
              <button className="forgot-back" type="button" onClick={() => onNavigate('login')}>← Quay lại đăng nhập</button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="forgot-step">
              <div className="forgot-heading">
                <span><MailCheck size={24} /></span>
                <div>
                  <h1>Xác minh mã OTP</h1>
                  <p>Kiểm tra hộp thư Gmail</p>
                </div>
              </div>
              <div className="otp-notice">
                <span>Mã xác thực đã được gửi đến <strong>{maskedAccount}</strong></span>
                <button type="button" onClick={() => { setStep(1); setErrorMessage(''); }}>Sửa email</button>
              </div>
              <div className="otp-grid">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    aria-label={`OTP ${index + 1}`}
                  />
                ))}
              </div>
              
              <div style={{ textAlign: 'center', margin: '14px 0' }}>
                {countdown > 0 ? (
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Gửi lại mã sau <strong>{countdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      textDecoration: 'underline'
                    }}
                  >
                    {loading ? 'Đang gửi lại...' : 'Chưa nhận được mã? Gửi lại mã'}
                  </button>
                )}
              </div>

              <p className="forgot-hint">Vui lòng kiểm tra cả thư mục Spam/Thư rác nếu không thấy trong Hộp thư đến</p>
              
              <button className="auth-primary" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <><Loader2 size={18} className="animate-spin" /> Đang kiểm tra OTP...</> : 'Xác nhận mã OTP'}
              </button>
              <button className="forgot-back" type="button" onClick={() => { setStep(1); setErrorMessage(''); }}>← Quay lại</button>
            </form>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="forgot-step">
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
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrorMessage('');
                }}
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
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setErrorMessage('');
                }}
                required
              />
              <button className="auth-primary" type="submit" disabled={loading || passwordScore < 3 || password !== confirmPassword} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <><Loader2 size={18} className="animate-spin" /> Đang cập nhật...</> : 'Cập nhật mật khẩu'}
              </button>
              <button className="forgot-back" type="button" onClick={() => { setStep(2); setErrorMessage(''); }}>← Quay lại</button>
            </form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="forgot-step success-step">
              <div className="success-check"><Check size={40} /></div>
              <h1>Mật khẩu đã được cập nhật thành công!</h1>
              <p>Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ</p>
              <div className="success-note">
                <Check size={18} />
                <div>
                  <strong>Bảo mật tài khoản đã được cập nhật</strong>
                  <span>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · Hôm nay</span>
                </div>
              </div>
              <button className="auth-primary" type="button" onClick={() => onNavigate('login')}>Đăng nhập ngay</button>
              <p className="forgot-hint">Tự động chuyển hướng sau 3 giây...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

