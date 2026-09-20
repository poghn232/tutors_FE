import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Clock, 
  Hourglass, 
  Video, 
  Lock, 
  Star, 
  Copy, 
  CheckCheck, 
  ExternalLink, 
  Tag, 
  CreditCard,
  QrCode,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import paymentService from '../services/paymentService';

export default function CheckoutFlow({ 
  tutor, 
  bookingDetails, 
  onBack, 
  onNavigate 
}) {
  // Step: 1 = 'Xem lại', 2 = 'Thanh toán', 3 = 'Xác nhận'
  const [step, setStep] = useState(1);

  // Tutor defaults matching Figma screenshots
  const currentTutor = tutor || {
    id: 1,
    fullName: 'Hoàng Thiên Ứng',
    school: 'Đại học bách khoa',
    title: 'TS. Nguyễn Thị Hoa', // for step 3 confirmation
    rating: 4.9,
    reviewsCount: 127,
    hourlyRate: 250000,
    subjects: ['Toán học', 'Vật lý', 'Tin học'],
    avatarUrl: null
  };

  // Booking details from parent or fallbacks
  const details = bookingDetails || {
    subject: 'Toán học',
    allSubjects: 'Toán học, Vật lý, Tin học',
    date: '2026-09-14',
    time: '10:00 SA',
    duration: '60 phút',
    format: 'Gọi video (Google Meet)',
    lessonPrice: 250000,
    bookingFeeRate: 0.05, // 5%
    meetLink: 'meet.google.com/abc-def-ghi'
  };

  // Payment method selection in Step 2: 'vietqr' | 'card' | 'paypal' | 'apple'
  const [paymentMethod, setPaymentMethod] = useState('vietqr');
  const [bookingOrderCode, setBookingOrderCode] = useState(() => 'TUTORA' + Math.floor(100000 + Math.random() * 900000));
  const [copiedField, setCopiedField] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleRegenerateQR = () => {
    setBookingOrderCode('TUTORA' + Math.floor(100000 + Math.random() * 900000));
    setTimeLeft(600);
  };

  // MB Bank Config
  const BANK_CONFIG = {
    bankId: 'MB',
    bankName: 'MB Bank (Ngân hàng Quân Đội)',
    accountNumber: '0913511637',
    accountName: 'PHAM GIA PHONG'
  };

  // Discount code
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Link Meet copy state
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculate pricing
  const lessonPrice = details.lessonPrice || 250000;
  const bookingFee = Math.round(lessonPrice * (details.bookingFeeRate || 0.05));
  const subtotal = lessonPrice + bookingFee;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num) + 'đ';
  };

  // Polling check SePay webhook status for booking
  useEffect(() => {
    if (step !== 2 || paymentMethod !== 'vietqr') return;

    const interval = setInterval(async () => {
      try {
        const res = await paymentService.checkSepayStatus(bookingOrderCode);
        if (res && res.data && res.data.paid) {
          clearInterval(interval);
          setStep(3); // Advance to confirmed step
        }
      } catch (e) {
        // silent
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [step, paymentMethod, bookingOrderCode]);

  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleCopy = (text, fieldName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    if (discountCode.trim().toUpperCase() === 'TUTORA' || discountCode.trim().toUpperCase() === 'GIASU10') {
      const discount = Math.round(lessonPrice * 0.1); // 10% off
      setDiscountAmount(discount);
      setDiscountApplied(true);
    } else {
      alert('Mã giảm giá không hợp lệ. Bạn có thể thử mã "TUTORA" để được giảm 10%!');
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://${details.meetLink}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isPaymentValid = () => {
    if (paymentMethod === 'vietqr') return true;
    if (paymentMethod === 'apple') return true;
    if (paymentMethod === 'paypal') return paypalEmail.includes('@');
    if (paymentMethod === 'card') return cardNumber.trim().length >= 12 && cardExpiry.trim() && cardCvv.trim();
    return true;
  };

  const handleCheckBookingPayment = async () => {
    try {
      const res = await paymentService.checkSepayStatus(bookingOrderCode);
      if (res && res.data && res.data.paid) {
        setStep(3);
      } else {
        alert('Hệ thống đang chờ ngân hàng xác nhận giao dịch. Vui lòng chuyển khoản đúng nội dung và chờ giây lát.');
      }
    } catch (e) {
      alert('Chưa nhận được giao dịch. Vui lòng quét mã QR chuyển tiền đúng cú pháp.');
    }
  };

  const handleProcessPayment = () => {
    if (paymentMethod === 'vietqr') {
      handleCheckBookingPayment();
      return;
    }
    if (!isPaymentValid()) return;
    setStep(3);
  };

  return (
    <div className="figma-checkout-wrapper">
      {/* Playful Floating Geometric Shapes (Figma Design) */}
      <div className="figma-shape shape-yellow-circle" />
      <div className="figma-shape shape-peach-box" />
      <div className="figma-shape shape-pink-pill" />
      <div className="figma-shape shape-peach-wireframe" />
      <div className="figma-shape shape-lavender-diamond" />
      <div className="figma-shape shape-yellow-black-square" />
      <div className="figma-shape shape-mint-circle" />

      <div className="figma-checkout-container">
        {/* Breadcrumb back link */}
        <div style={{ marginBottom: '16px' }}>
          <button 
            type="button" 
            className="figma-back-link"
            onClick={() => {
              if (step === 2) setStep(1);
              else if (onBack) onBack();
              else if (onNavigate) onNavigate('tutors');
            }}
          >
            ← Quay lại hồ sơ
          </button>
        </div>

        {/* Page Title */}
        <h1 className="figma-checkout-title">
          Thanh Toán
        </h1>

        {/* Stepper Progress (Step 1, 2, 3) */}
        <div className="figma-stepper">
          {/* Step 1: Xem lại */}
          <div 
            className={`figma-step-item ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}
            onClick={() => { if (step > 1 && step < 3) setStep(1); }}
            style={{ cursor: step > 1 && step < 3 ? 'pointer' : 'default' }}
          >
            <div className="figma-step-circle">
              {step > 1 ? <Check size={14} strokeWidth={3} /> : '1'}
            </div>
            <span className="figma-step-label">Xem lại</span>
          </div>

          <div className={`figma-step-connector ${step > 1 ? 'completed' : ''}`} />

          {/* Step 2: Thanh toán */}
          <div 
            className={`figma-step-item ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}
            onClick={() => { if (step === 1) setStep(2); }}
            style={{ cursor: step === 1 ? 'pointer' : 'default' }}
          >
            <div className="figma-step-circle">
              {step > 2 ? <Check size={14} strokeWidth={3} /> : '2'}
            </div>
            <span className="figma-step-label">Thanh toán</span>
          </div>

          <div className={`figma-step-connector ${step > 2 ? 'completed' : ''}`} />

          {/* Step 3: Xác nhận */}
          <div className={`figma-step-item ${step === 3 ? 'active' : ''}`}>
            <div className="figma-step-circle">
              3
            </div>
            <span className="figma-step-label">Xác nhận</span>
          </div>
        </div>

        {/* ========================================================
            STEP 1 & STEP 2: 2-COLUMN LAYOUT
           ======================================================== */}
        {step < 3 && (
          <div className="figma-checkout-grid">
            {/* LEFT COLUMN: STEP CONTENT */}
            <div className="figma-main-card">
              {/* STEP 1: XEM LẠI BUỔI HỌC */}
              {step === 1 && (
                <div>
                  <h3 className="figma-card-heading">Xem lại buổi học</h3>

                  {/* Tutor Info Box */}
                  <div className="figma-tutor-box">
                    <div className="figma-tutor-avatar">
                      {/* Friendly illustrated avatar icon */}
                      <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                        <rect width="42" height="42" rx="10" fill="#fef08a" />
                        <circle cx="21" cy="17" r="8" fill="#f59e0b" />
                        <path d="M10 35C10 29.5 15 26 21 26C27 26 32 29.5 32 35" fill="#f59e0b" />
                        <circle cx="18" cy="16" r="1.5" fill="#ffffff" />
                        <circle cx="24" cy="16" r="1.5" fill="#ffffff" />
                        <path d="M19 20C20 21 22 21 23 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div className="figma-tutor-name">{currentTutor.fullName}</div>
                      <div className="figma-tutor-sub">{currentTutor.school}</div>
                      <div className="figma-tutor-rating">
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <span><strong>{currentTutor.rating}</strong> ({currentTutor.reviewsCount} đánh giá)</span>
                      </div>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="figma-detail-list">
                    {/* Row 1: Môn học */}
                    <div className="figma-detail-row">
                      <div className="figma-detail-label">
                        <BookOpen size={16} color="#64748b" />
                        <span>Môn học</span>
                      </div>
                      <div className="figma-detail-value">
                        {details.allSubjects || currentTutor.subjects?.join(', ') || 'Toán học, Vật lý, Tin học'}
                      </div>
                    </div>

                    {/* Row 2: Ngày */}
                    <div className="figma-detail-row">
                      <div className="figma-detail-label">
                        <Calendar size={16} color="#64748b" />
                        <span>Ngày</span>
                      </div>
                      <div className="figma-detail-value">
                        {details.date}
                      </div>
                    </div>

                    {/* Row 3: Giờ */}
                    <div className="figma-detail-row">
                      <div className="figma-detail-label">
                        <Clock size={16} color="#64748b" />
                        <span>Giờ</span>
                      </div>
                      <div className="figma-detail-value">
                        {details.time}
                      </div>
                    </div>

                    {/* Row 4: Thời lượng */}
                    <div className="figma-detail-row">
                      <div className="figma-detail-label">
                        <Hourglass size={16} color="#64748b" />
                        <span>Thời lượng</span>
                      </div>
                      <div className="figma-detail-value">
                        {details.duration}
                      </div>
                    </div>

                    {/* Row 5: Hình thức */}
                    <div className="figma-detail-row">
                      <div className="figma-detail-label">
                        <Video size={16} color="#64748b" />
                        <span>Hình thức</span>
                      </div>
                      <div className="figma-detail-value">
                        {details.format}
                      </div>
                    </div>
                  </div>

                  {/* Subject Tag */}
                  <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                    <span className="figma-subject-pill">
                      {details.subject || 'Toán học'}
                    </span>
                  </div>

                  {/* Continue Button */}
                  <button 
                    type="button" 
                    className="figma-btn-primary"
                    onClick={() => setStep(2)}
                  >
                    Tiếp tục Thanh toán →
                  </button>
                </div>
              )}

              {/* STEP 2: PHƯƠNG THỨC THANH TOÁN */}
              {step === 2 && (
                <div>
                  <h3 className="figma-card-heading">Phương thức Thanh toán</h3>

                  {/* Segmented Payment Tabs */}
                  <div className="figma-payment-tabs">
                    <button
                      type="button"
                      className={`figma-payment-tab ${paymentMethod === 'vietqr' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('vietqr')}
                    >
                      VietQR MB Bank
                    </button>
                    <button
                      type="button"
                      className={`figma-payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      Thẻ tín dụng
                    </button>
                    <button
                      type="button"
                      className={`figma-payment-tab ${paymentMethod === 'paypal' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      PayPal
                    </button>
                    <button
                      type="button"
                      className={`figma-payment-tab ${paymentMethod === 'apple' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('apple')}
                    >
                      Apple Pay
                    </button>
                  </div>

                  {/* Sub-view: VietQR MB Bank */}
                  {paymentMethod === 'vietqr' && (
                    <div style={{ padding: '16px 0 10px 0' }}>
                      {timeLeft <= 0 ? (
                        /* TIMEOUT EXPIRED NOTIFICATION */
                        <div style={{
                          background: '#fff1f2',
                          border: '2px solid #e11d48',
                          borderRadius: '18px',
                          padding: '24px 20px',
                          textAlign: 'center',
                          marginBottom: '16px',
                          boxShadow: '3px 3px 0px #0f172a'
                        }}>
                          <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            backgroundColor: '#ffe4e6',
                            color: '#e11d48',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px auto'
                          }}>
                            <AlertTriangle size={28} />
                          </div>

                          <h4 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 900, color: '#9f1239' }}>
                            Mã QR thanh toán đã hết hạn!
                          </h4>

                          <p style={{ margin: '0 0 16px 0', fontSize: '0.86rem', color: '#881337', lineHeight: 1.5 }}>
                            Phiên thanh toán học phí (Mã: <b>{bookingOrderCode}</b>) đã kết thúc sau 10 phút để đảm bảo an toàn.
                            <br />
                            • <b>Nếu bạn đã chuyển khoản:</b> Vui lòng bấm <i>"Kiểm tra lại giao dịch"</i> hoặc lưu lại biên lai ngân hàng để hệ thống đối soát.
                            <br />
                            • <b>Nếu bạn chưa chuyển:</b> Bấm <i>"Tạo mã QR mới"</i> để gia hạn thêm 10 phút.
                          </p>

                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={handleRegenerateQR}
                              style={{
                                background: '#7c3aed',
                                color: '#ffffff',
                                border: '2px solid #0f172a',
                                boxShadow: '2px 2px 0px #0f172a',
                                borderRadius: '10px',
                                padding: '10px 18px',
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <RefreshCw size={16} /> Tạo mã QR mới (Gia hạn 10 phút)
                            </button>

                            <button
                              type="button"
                              onClick={handleCheckBookingPayment}
                              style={{
                                background: '#ffffff',
                                color: '#0f172a',
                                border: '2px solid #0f172a',
                                boxShadow: '2px 2px 0px #0f172a',
                                borderRadius: '10px',
                                padding: '10px 18px',
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                cursor: 'pointer'
                              }}
                            >
                              Kiểm tra lại giao dịch
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '170px 1fr',
                            gap: '18px',
                            background: '#f8fafc',
                            border: '1.5px solid #0f172a',
                            borderRadius: '18px',
                            padding: '16px',
                            marginBottom: '16px',
                            alignItems: 'center'
                          }}>
                            {/* QR Image */}
                            <div style={{ textAlign: 'center' }}>
                              <div style={{
                                background: '#ffffff',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '6px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                              }}>
                                <img 
                                  src={`https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNumber}-compact2.png?amount=${finalTotal}&addInfo=${bookingOrderCode}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`} 
                                  alt="VietQR MB Bank" 
                                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} 
                                />
                              </div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                fontSize: '0.72rem',
                                color: '#64748b',
                                marginTop: '6px',
                                fontWeight: 700
                              }}>
                                <Clock size={12} /> Hết hạn: <span style={{ color: '#ef4444' }}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                              </div>
                            </div>

                            {/* Transfer Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                              <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                                  Ngân hàng thụ hưởng
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#005baa' }}>
                                  MB Bank · Quân Đội
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                                  Số tài khoản
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontWeight: 900, fontSize: '1rem', color: '#0f172a' }}>
                                    {BANK_CONFIG.accountNumber}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(BANK_CONFIG.accountNumber, 'acc')}
                                    style={{
                                      background: '#eff6ff',
                                      border: '1px solid #bfdbfe',
                                      borderRadius: '6px',
                                      padding: '2px 6px',
                                      cursor: 'pointer',
                                      color: '#1d4ed8',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    {copiedField === 'acc' ? <CheckCheck size={11} /> : <Copy size={11} />}
                                    {copiedField === 'acc' ? 'Đã chép' : 'Chép'}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                                  Chủ tài khoản
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                                  {BANK_CONFIG.accountName}
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                                  Số tiền thanh toán
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#059669' }}>
                                    {formatVND(finalTotal)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(finalTotal.toString(), 'amount')}
                                    style={{
                                      background: '#ecfdf5',
                                      border: '1px solid #a7f3d0',
                                      borderRadius: '6px',
                                      padding: '2px 6px',
                                      cursor: 'pointer',
                                      color: '#047857',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    {copiedField === 'amount' ? <CheckCheck size={11} /> : <Copy size={11} />}
                                    {copiedField === 'amount' ? 'Đã chép' : 'Chép'}
                                  </button>
                                </div>
                              </div>

                              <div style={{
                                background: '#fffbeb',
                                border: '1px solid #fde68a',
                                borderRadius: '8px',
                                padding: '6px 8px'
                              }}>
                                <div style={{ fontSize: '0.68rem', color: '#92400e', fontWeight: 800, textTransform: 'uppercase' }}>
                                  Nội dung chuyển khoản (bắt buộc)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                                  <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#b45309', fontFamily: 'monospace' }}>
                                    {bookingOrderCode}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(bookingOrderCode, 'content')}
                                    style={{
                                      background: '#fef3c7',
                                      border: '1px solid #fcd34d',
                                      borderRadius: '6px',
                                      padding: '2px 8px',
                                      cursor: 'pointer',
                                      color: '#b45309',
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    {copiedField === 'content' ? <CheckCheck size={11} /> : <Copy size={11} />}
                                    {copiedField === 'content' ? 'Đã chép' : 'Chép'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Radar status indicator */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '12px',
                            padding: '10px 14px',
                            marginBottom: '16px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '9px',
                                height: '9px',
                                borderRadius: '50%',
                                backgroundColor: '#22c55e',
                                boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.2)',
                                animation: 'pulse 1.5s infinite'
                              }} />
                              <span style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700 }}>
                                Hệ thống tự động duyệt ngay khi MB Bank nhận tiền
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={handleCheckBookingPayment}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #86efac',
                                borderRadius: '8px',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                color: '#15803d',
                                cursor: 'pointer'
                              }}
                            >
                              Kiểm tra ngay
                            </button>
                          </div>

                          <button 
                            type="button" 
                            className="figma-btn-primary"
                            onClick={handleProcessPayment}
                          >
                            Xác nhận đã chuyển {formatVND(finalTotal)}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Sub-view: Apple Pay (Figma Image 1) */}
                  {paymentMethod === 'apple' && (
                    <div style={{ textAlign: 'center', padding: '24px 0 10px 0' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                        Apple Pay
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                        Sử dụng Touch ID hoặc Face ID để xác thực
                      </div>

                      {/* Security Lock Note */}
                      <div className="figma-security-note">
                        <Lock size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }} />
                        Bảo mật bằng mã hóa SSL 256-bit · Tuân thủ PCI DSS · Không lưu trên máy chủ của chúng tôi
                      </div>

                      {/* Apple Pay Green Action Button (Figma Image 1) */}
                      <button 
                        type="button" 
                        className="figma-btn-apple-green"
                        onClick={handleProcessPayment}
                      >
                        Thanh toán {formatVND(finalTotal)}
                      </button>
                    </div>
                  )}

                  {/* Sub-view: PayPal (Figma Image 2) */}
                  {paymentMethod === 'paypal' && (
                    <div style={{ padding: '12px 0 10px 0' }}>
                      <div className="figma-input-group">
                        <label className="figma-input-label">EMAIL PAYPAL</label>
                        <input 
                          type="email"
                          className="figma-text-input"
                          placeholder="email@cua.ban.com"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                        />
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
                          Bạn sẽ được chuyển đến PayPal để hoàn tất thanh toán
                        </div>
                      </div>

                      {/* Security Lock Note */}
                      <div className="figma-security-note">
                        <Lock size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }} />
                        Bảo mật bằng mã hóa SSL 256-bit · Tuân thủ PCI DSS · Không lưu trên máy chủ của chúng tôi
                      </div>

                      {/* PayPal Action Button */}
                      <button 
                        type="button" 
                        className={paypalEmail.trim() ? "figma-btn-primary" : "figma-btn-disabled"}
                        disabled={!paypalEmail.trim()}
                        onClick={handleProcessPayment}
                      >
                        Thanh toán {formatVND(finalTotal)}
                      </button>
                    </div>
                  )}

                  {/* Sub-view: Credit Card */}
                  {paymentMethod === 'card' && (
                    <div style={{ padding: '12px 0 10px 0' }}>
                      <div className="figma-input-group">
                        <label className="figma-input-label">SỐ THẺ TÍN DỤNG / GHI NỢ</label>
                        <input 
                          type="text"
                          className="figma-text-input"
                          placeholder="4532 •••• •••• 8921"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>

                      <div className="figma-input-group">
                        <label className="figma-input-label">HỌ VÀ TÊN CHỦ THẺ</label>
                        <input 
                          type="text"
                          className="figma-text-input"
                          placeholder="NGUYEN VAN A"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div className="figma-input-group">
                          <label className="figma-input-label">HẾT HẠN (MM/YY)</label>
                          <input 
                            type="text"
                            className="figma-text-input"
                            placeholder="12/28"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />
                        </div>

                        <div className="figma-input-group">
                          <label className="figma-input-label">MÃ CVV/CVC</label>
                          <input 
                            type="password"
                            className="figma-text-input"
                            placeholder="•••"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Security Lock Note */}
                      <div className="figma-security-note">
                        <Lock size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }} />
                        Bảo mật bằng mã hóa SSL 256-bit · Tuân thủ PCI DSS · Không lưu trên máy chủ của chúng tôi
                      </div>

                      {/* Card Action Button */}
                      <button 
                        type="button" 
                        className={isPaymentValid() ? "figma-btn-primary" : "figma-btn-disabled"}
                        disabled={!isPaymentValid()}
                        onClick={handleProcessPayment}
                      >
                        Thanh toán {formatVND(finalTotal)}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: TÓM TẮT ĐƠN HÀNG (FIGMA EXACT DESIGN) */}
            <div className="figma-summary-card">
              <h3 className="figma-summary-heading">Tóm tắt đơn hàng</h3>

              <div className="figma-summary-line">
                <span className="figma-summary-label">Buổi học 60 phút</span>
                <span className="figma-summary-val">{formatVND(lessonPrice)}</span>
              </div>

              <div className="figma-summary-line">
                <span className="figma-summary-label">Phí đặt lịch (5%)</span>
                <span className="figma-summary-val">{formatVND(bookingFee)}</span>
              </div>

              {discountApplied && (
                <div className="figma-summary-line" style={{ color: '#059669' }}>
                  <span className="figma-summary-label">Khuyến mãi ({discountCode.toUpperCase()})</span>
                  <span className="figma-summary-val">-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="figma-summary-divider" />

              <div className="figma-summary-total">
                <span>Tổng cộng</span>
                <span>{formatVND(finalTotal)}</span>
              </div>

              {/* Cancellation policy green box (Figma design) */}
              <div className="figma-cancel-box">
                <strong>Hủy miễn phí</strong> trước 24 giờ so với giờ học. Sau thời điểm đó, phí hủy là 50%.
              </div>

              {/* Discount code link / expander */}
              <div style={{ marginTop: '16px' }}>
                {!showDiscountInput ? (
                  <button 
                    type="button"
                    className="figma-discount-link"
                    onClick={() => setShowDiscountInput(true)}
                  >
                    + Nhập mã giảm giá
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input 
                      type="text" 
                      className="figma-text-input" 
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      placeholder="Mã giảm giá (ví dụ: TUTORA)" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="figma-btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'auto' }}
                      onClick={handleApplyDiscount}
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: ĐẶT LỊCH THÀNH CÔNG! (FIGMA IMAGE 4 EXACT DESIGN)
           ======================================================== */}
        {step === 3 && (
          <div className="figma-success-card">
            {/* Party popper */}
            <div className="figma-success-icon">
              🎉
            </div>

            {/* Title */}
            <h2 className="figma-success-title">
              Đặt lịch thành công!
            </h2>

            {/* Subtitle */}
            <p className="figma-success-subtitle">
              Buổi học với <strong>{currentTutor.title || currentTutor.fullName}</strong> vào ngày <strong>{details.date}</strong> lúc <strong>{details.time}</strong> đã được xác nhận.
            </p>

            {/* Confirmation Box (Cyan background with border) */}
            <div className="figma-success-box">
              <div className="figma-success-row">
                <span className="figma-success-box-label">Buổi học</span>
                <span className="figma-success-box-val"><strong>{details.subject || 'Toán học'} · 60 phút</strong></span>
              </div>

              <div className="figma-success-row">
                <span className="figma-success-box-label">Link Meet</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a 
                    href={`https://${details.meetLink}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="figma-meet-link"
                  >
                    {details.meetLink}
                  </a>
                  <button 
                    type="button" 
                    onClick={handleCopyLink}
                    title="Sao chép link Meet"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', padding: 0 }}
                  >
                    {copiedLink ? <CheckCheck size={16} color="#059669" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="figma-success-row">
                <span className="figma-success-box-label">Đã thanh toán</span>
                <span className="figma-success-box-val figma-paid-amount">
                  {formatVND(finalTotal)}
                </span>
              </div>
            </div>

            {/* Email note */}
            <p className="figma-success-note">
              Email xác nhận đã được gửi đến tài khoản của bạn. Bạn có thể hủy miễn phí trước 24 giờ.
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                type="button"
                className="figma-btn-primary"
                onClick={() => onNavigate ? onNavigate('classes') : (window.location.href = '/')}
              >
                Xem bảng điều khiển
              </button>

              <button 
                type="button"
                className="figma-btn-outline"
                onClick={() => onNavigate ? onNavigate('tutors') : setStep(1)}
              >
                Tìm gia sư khác
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
