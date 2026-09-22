import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { BookOpen, UserRound, Info, X, MailCheck, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import TutoraLogo from '../components/TutoraLogo';
import { authService, getOtpRequestErrorMessage } from '../services/authService';
import { isValidEmail, isValidPhone, normalizePhone } from '../utils/validation';

export default function RegisterPage({ onNavigate }) {
  const { register, loginWithGoogle } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Thông tin tài khoản, 2: Xác thực OTP Gmail
  const [role, setRole] = useState(() => localStorage.getItem('giasuhq_last_role') || 'PARENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);

  // Đếm ngược gửi lại OTP
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

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

  // Bước 1: Kiểm tra form & Gửi OTP về Gmail
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fullName || !email || !password) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ (ví dụ: yourname@gmail.com).');
      return;
    }

    if (!isValidPhone(phone)) {
      setError('Số điện thoại không đúng định dạng. Hãy nhập số Việt Nam 10 chữ số, ví dụ 0901234567.');
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
      const res = await authService.sendRegisterOtp(normalizedEmail, fullName.trim());
      const devOtp = res?.data;
      if (devOtp) {
        setSuccessMsg(`Mã xác thực OTP (thử nghiệm): ${devOtp}`);
        setOtp(String(devOtp).split('').slice(0, 6));
      } else {
        setSuccessMsg(`Mã xác thực OTP đã được gửi về Gmail: ${email.trim().toLowerCase()}`);
        setOtp(['', '', '', '', '', '']);
      }
      setCountdown(60);
      setStep(2);
    } catch (err) {
      const msg = getOtpRequestErrorMessage(
        err,
        'Không thể gửi mã xác nhận OTP. Vui lòng kiểm tra lại email hoặc kết nối máy chủ.'
      );
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await authService.sendRegisterOtp(email.trim().toLowerCase(), fullName.trim());
      const devOtp = res?.data;
      if (devOtp) {
        setSuccessMsg(`Đã cấp lại mã OTP mới: ${devOtp}`);
        setOtp(String(devOtp).split('').slice(0, 6));
      } else {
        setSuccessMsg(`Đã gửi lại mã xác thực mới về Gmail: ${email.trim().toLowerCase()}`);
        setOtp(['', '', '', '', '', '']);
      }
      setCountdown(60);
    } catch (err) {
      setError(getOtpRequestErrorMessage(err, 'Gửi lại mã thất bại. Vui lòng thử lại.'));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const next = [...otp];
    next[index] = value.replace(/\D/g, '').slice(0, 1);
    setOtp(next);
    setError('');

    if (value && index < 5) {
      const nextInput = document.getElementById(`reg-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Bước 2: Xác nhận OTP & Hoàn tất Đăng ký
  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setError('');
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: normalizePhone(phone),
        password,
        role,
        otp: otpCode
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
        setError(res.message || 'Xác thực hoặc đăng ký không thành công. Vui lòng thử lại.');
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
            <button type="button" className="active">Đăng ký (Bước {step}/2)</button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMsg && !error && (
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
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* BƯỚC 1: NHẬP THÔNG TIN TÀI KHOẢN */}
          {step === 1 && (
            <>
              <form onSubmit={handleRequestOtp} className="auth-form">
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
                  placeholder="Họ và tên *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <input
                  id="email"
                  type="email"
                  className="auth-input"
                  placeholder="Địa chỉ Gmail / Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  className="auth-input"
                  placeholder="Số điện thoại liên hệ"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <div className="auth-field-grid">
                  <input
                    id="password"
                    type="password"
                    className="auth-input"
                    placeholder="Mật khẩu *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    id="confirmPassword"
                    type="password"
                    className="auth-input"
                    placeholder="Nhập lại mật khẩu *"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="auth-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Đang gửi mã xác thực Gmail...</> : 'Tiếp tục xác nhận OTP'}
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
            </>
          )}

          {/* BƯỚC 2: XÁC THỰC MÃ OTP QUA GMAIL */}
          {step === 2 && (
            <form onSubmit={handleSubmitOtp} className="auth-form" style={{ marginTop: '8px' }}>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#dbeafe',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto'
                }}>
                  <MailCheck size={28} />
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Xác thực mã OTP Gmail
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                  Mã xác minh gồm 6 số đã được gửi đến:<br />
                  <strong style={{ color: '#2563eb' }}>{email}</strong>
                </p>
              </div>

              <div className="otp-grid" style={{ marginBottom: '14px' }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`reg-otp-${index}`}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    aria-label={`OTP ${index + 1}`}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
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
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '6px 0 0 0' }}>
                  (Vui lòng kiểm tra cả hòm thư Spam / Rác nếu chưa thấy)
                </p>
              </div>

              <button type="submit" className="auth-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <><Loader2 size={18} className="animate-spin" /> Đang kiểm tra & tạo tài khoản...</> : 'Xác nhận & Hoàn tất Đăng ký'}
              </button>

              <button
                type="button"
                className="forgot-back"
                onClick={() => { setStep(1); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%'
                }}
              >
                <ArrowLeft size={16} /> Quay lại chỉnh sửa thông tin
              </button>
            </form>
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
